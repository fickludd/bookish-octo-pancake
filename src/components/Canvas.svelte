<script>
  let { activeTool, tools, width, height, layers, activeLayerId, addCommand } = $props();
  
  let mainCanvas = $state();
  let mainContext = $state();
  let coords = $state();
  let layerCanvases = $state(new Map());
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
    
    // Resize all layer canvases
    layerCanvases.forEach((layerCanvas) => {
      layerCanvas.width = width;
      layerCanvas.height = height;
    });
  }
  
  function getOrCreateLayerCanvas(layerId) {
    if (!layerCanvases.has(layerId)) {
      const baseCanvas = createLayerCanvas();
      const latestCanvas = createLayerCanvas();
      layerCanvases.set(layerId, {base: baseCanvas, latest: latestCanvas});
    }
    return layerCanvases.get(layerId);
  }

  function createLayerCanvas() {
    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = width;
    layerCanvas.height = height;
    layerCanvas.style.position = 'absolute';
    
    // Calculate position to center the canvas
    const left = (containerRect.width - width) / 2;
    const top = (containerRect.height - height) / 2;
    
    layerCanvas.style.left = `${left}px`;
    layerCanvas.style.top = `${top}px`;
    layerCanvas.style.pointerEvents = 'none';
    return layerCanvas;
  }
  
  function drawAllLayers() {
    mainContext.clearRect(0, 0, width, height);
    
    // Draw layers in order, respecting visibility
    layers.forEach(layer => {
      if (layer.visible) {
        const { base, latest } = getOrCreateLayerCanvas(layer.id);
        mainContext.drawImage(latest, 0, 0);
      }
    });
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
  
  let isDrawing = false;
</script>


<!--svelte:window onresize={resize} /-->

<div class="canvas-container">
  <canvas
    bind:this={mainCanvas}
    onpointerdown={(e) => {
      coords = { x: e.offsetX, y: e.offsetY };
      const { base, latest } = getOrCreateLayerCanvas(activeLayerId);
      const layerContext = latest.getContext('2d');
      const activeLayer = layers.find(l => l.id === activeLayerId);
      
      const command = activeTool.startCommand(activeTool, coords, activeLayer);
      command.applyStep(layerContext);

      drawAllLayers();
    }}
    onpointerup={() => {
      endCommand();
    }}
    onpointerleave={() => {
      coords = null;
    }}
    onpointermove={(e) => {
      const previous = coords;
      coords = { x: e.offsetX, y: e.offsetY };

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
    }}
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
  }

  canvas {
    background-color: #908383;
    cursor: crosshair;
  }
</style> 