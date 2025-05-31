<script>
  import { getOrCreateLayerCanvas, resize as resizeCanvas } from '$lib/canvasState';
  import { onMount, onDestroy } from 'svelte';
  import { screenToCanvas, calculateCanvasPanMovement, canvasToScreen } from '$lib/coordinateTransform';

  let { activeTool, width, height, layers, activeLayerId, addCommand, redrawTrigger, zoom = 1, pan = { x: 0, y: 0 }, setPan = () => {}, setZoom = () => {} } = $props();
  
  let mainCanvas = $state();
  let mainContext = $state();
  let coords = $state();
  let containerRect = $state();
  
  $effect(() => {
    mainContext = mainCanvas.getContext('2d');
    resize();
  });
  
  function resize() {
    mainCanvas.width = width;
    mainCanvas.height = height;
    
    // Update container rect for positioning
    const container = document.querySelector('.canvas-container');
    if (container) {
      containerRect = container.getBoundingClientRect();
    }
    
    resizeCanvas(width, height);
  }
  
  function drawAllLayers() {
    //mainContext.setTransform(zoom, 0, 0, zoom, 0, 0);
    //mainContext.clearRect(0, 0, width / zoom, height / zoom);
    mainContext.clearRect(0, 0, width, height);
    
    // Draw layers in order, respecting visibility
    layers.forEach(layer => {
      if (layer.visible) {
        const { base, latest } = getOrCreateLayerCanvas(layer.id);
        //mainContext.drawImage(base, 0, 0);
        mainContext.drawImage(latest, 0, 0);
      }
    });
    mainContext.setTransform(1, 0, 0, 1, 0, 0);
  }

  function endCommand() {
    const activeLayer = layers.find(l => l.id === activeLayerId);
    const command = activeTool.endCommand(activeTool, activeLayer);
    addCommand(command);
  }
  
  // Redraw when layers or their visibility changes
  $effect(() => {
    layers;
    drawAllLayers();
  });

  // Redraw when redrawTrigger changes
  $effect(() => {
    redrawTrigger;
    zoom;
    pan;
    drawAllLayers();
  });
  
  let isDrawing = false;
  let isPanning = false;
  let lastPan = { x: 0, y: 0 };
  let lastPointer = { x: 0, y: 0 };
  let spacePressed = false;

  function handleWheel(e) {
    if (e.ctrlKey || e.metaKey || e.deltaY !== 0) {
      e.preventDefault();
      /*
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const newZoom = Math.max(0.1, Math.min(zoom * factor, 10));
      
      // Get mouse position in screen space
      const rect = mainCanvas.getBoundingClientRect();
      const mouseScreenX = e.clientX - rect.left;
      const mouseScreenY = e.clientY - rect.top;
      
      // Convert mouse position to canvas space
      const mouseCanvas = screenToCanvas(mouseScreenX, mouseScreenY, width, height, zoom, pan);
      
      // Convert back to screen space with new zoom
      const newMouseScreen = canvasToScreen(mouseCanvas.x, mouseCanvas.y, width, height, newZoom, pan);
      
      // Calculate new pan to keep mouse point in same screen position
      const newPan = {
        x: mouseScreenX - newMouseScreen.x + pan.x,
        y: mouseScreenY - newMouseScreen.y + pan.y
      };
      
      setPan(newPan);
      setZoom(newZoom);
      */
    }
  }

  function handlePointerDown(e) {
    if (spacePressed) {
      isPanning = true;
      lastPointer = { x: e.clientX, y: e.clientY };
      lastPan = { ...pan };
      mainCanvas.style.cursor = 'grab';
    }
  }

  function handlePointerMove(e) {
    if (isPanning) {
      const screenDeltaX = e.clientX - lastPointer.x;
      const screenDeltaY = e.clientY - lastPointer.y;
      const movement = calculateCanvasPanMovement(screenDeltaX, screenDeltaY, zoom);
      setPan({ x: lastPan.x + movement.x, y: lastPan.y + movement.y });
    }
  }

  function handlePointerUp() {
    isPanning = false;
    mainCanvas.style.cursor = spacePressed ? 'grab' : 'crosshair';
  }

  function handleKeyDown(e) {
    if (e.code === 'Space') {
      spacePressed = true;
      mainCanvas.style.cursor = isPanning ? 'grab' : 'grab';
    }
  }
  function handleKeyUp(e) {
    if (e.code === 'Space') {
      spacePressed = false;
      if (!isPanning) mainCanvas.style.cursor = 'crosshair';
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  });
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  });
</script>

<div class="canvas-container">
  <canvas
    bind:this={mainCanvas}
    width={width}
    height={height}
    onwheel={handleWheel}
    onpointerdown={(e) => {
      handlePointerDown(e);
      if (!spacePressed) {
        const rect = mainCanvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        coords = screenToCanvas(screenX, screenY, zoom, pan);
        const { base, latest } = getOrCreateLayerCanvas(activeLayerId);
        const layerContext = latest.getContext('2d');
        const activeLayer = layers.find(l => l.id === activeLayerId);
        const command = activeTool.startCommand(activeTool, coords, activeLayer);
        command.applyStep(layerContext);
        drawAllLayers();
      }
    }}
    onpointermove={(e) => {
      handlePointerMove(e);
      if (!spacePressed) {
        const rect = mainCanvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const previous = coords;
        coords = screenToCanvas(screenX, screenY, zoom, pan);
        coords.pressure = e.pointerType === 'pen' ? (e.pressure || 1.0) : 1.0;
        if (e.buttons === 1) {
          e.preventDefault();
          const { base, latest } = getOrCreateLayerCanvas(activeLayerId);
          const context = latest.getContext('2d');
          const activeLayer = layers.find(l => l.id === activeLayerId);
          const step = activeTool.updateCommand(activeTool, coords, previous, activeLayer);
          step.applyStep(context);
          drawAllLayers();
        } else {
          endCommand();
        }
      }
    }}
    onpointerup={() => {
      handlePointerUp();
      if (!spacePressed) endCommand();
    }}
    onpointerleave={() => {
      coords = null;
      handlePointerUp();
    }}
    style="touch-action: none; transform: scale({zoom}) translate({pan.x}px, {pan.y}px); transform-origin: center;"
  ></canvas>
</div>

<style>
  .canvas-container {
    width: 100%;
    height: 100%;
    background-color: #2c3e50;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0;
    margin: 0;
  }

  canvas {
    background-color: #908383;
    cursor: crosshair;
    padding: 0;
    margin: 0;
  }
</style> 