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

  function handleResize() {
    const container = document.querySelector('.canvas-container');
    if (container) {
      containerRect = container.getBoundingClientRect();
    }
  }

  function drawAllLayers() {
    mainContext.clearRect(0, 0, width, height);
    
    // Draw layers in order, respecting visibility
    layers.forEach(layer => {
      if (layer.visible) {
        if (layer.type === 'image') {
          // Draw image layer
          mainContext.drawImage(layer.image, 0, 0);
        } else {
          // Draw regular layer
          const { base, latest } = getOrCreateLayerCanvas(layer.id);
          mainContext.drawImage(base, 0, 0);
          mainContext.drawImage(latest, 0, 0);
        }
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
    e.preventDefault();
    
    // Handle pan with two-finger scroll
    const movement = calculateCanvasPanMovement(e.deltaX, e.deltaY, zoom);
    setPan({
      x: pan.x - movement.x,
      y: pan.y - movement.y
    });
  }

  function handlePointerDown(e) {
    if (spacePressed) {
      isPanning = true;
      lastPointer = { x: e.clientX, y: e.clientY };
      lastPan = { ...pan };
      mainCanvas.style.cursor = 'grab';
    } else if (e.pointerType === 'pen') {
      mainCanvas.style.cursor = 'none';
    }
  }

  function handlePointerMove(e) {
    if (isPanning) {
      const screenDeltaX = e.clientX - lastPointer.x;
      const screenDeltaY = e.clientY - lastPointer.y;
      const movement = calculateCanvasPanMovement(screenDeltaX, screenDeltaY, zoom);
      setPan({ x: lastPan.x + movement.x, y: lastPan.y + movement.y });
    } else if (e.pointerType === 'pen') {
      mainCanvas.style.cursor = 'none';
    }
  }

  function handlePointerUp() {
    isPanning = false;
    if (spacePressed) {
      mainCanvas.style.cursor = 'grab';
    } else {
      mainCanvas.style.cursor = 'crosshair';
    }
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
      if (!isPanning) {
        mainCanvas.style.cursor = 'crosshair';
      }
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
    // Initial container rect update
    handleResize();
  });
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('resize', handleResize);
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
        const screenX = e.clientX;
        const screenY = e.clientY;
        coords = screenToCanvas(screenX, screenY, containerRect.width, containerRect.height, width, height, zoom, pan);
        coords.pressure = e.pointerType === 'pen' ? (e.pressure || 1.0) : 1.0;
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
        const screenX = e.clientX;
        const screenY = e.clientY;
        const previous = coords;
        coords = screenToCanvas(screenX, screenY, containerRect.width, containerRect.height, width, height, zoom, pan);
        console.log("coords", coords, screenX, screenY, containerRect.width, containerRect.height, width, height, zoom, pan);
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
    height: calc(100vh - 100px); /* Subtract toolbar (60px) and command history (40px) heights */
    background-color: var(--color-surface);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0;
    margin: 0;
    margin-bottom: 100px; /* Add margin to prevent overlap with fixed elements */
  }

  canvas {
    background-color: var(--color-canvas-bg);
    cursor: crosshair;
    padding: 0;
    margin: 0;
  }
</style> 