<script>
  let { activeTool, tools, width, height, layers, activeLayerId } = $props();
  
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
      layerCanvases.set(layerId, layerCanvas);
      
      // Add the canvas to the DOM
      const container = document.querySelector('.canvas-container');
      if (container) {
        //container.appendChild(layerCanvas);
      }
    }
    return layerCanvases.get(layerId);
  }
  
  function drawAllLayers() {
    mainContext.clearRect(0, 0, width, height);
    console.log('drawAllLayers', $state.snapshot(layers));

    
    // Draw layers in order, respecting visibility
    layers.forEach(layer => {
      if (layer.visible) {
        const layerCanvas = getOrCreateLayerCanvas(layer.id);
        mainContext.drawImage(layerCanvas, 0, 0);
        console.log('layer visible', layer.id);
      } else {
        console.log('layer not visible', layer.id);
      }
    });
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
      const tool = activeTool;
      const layerCanvas = getOrCreateLayerCanvas(activeLayerId);
      const layerContext = layerCanvas.getContext('2d');
      const activeLayer = layers.find(l => l.id === activeLayerId);
      
      // Draw initial point
      layerContext.fillStyle = activeLayer.color;
      layerContext.beginPath();
      layerContext.arc(coords.x, coords.y, tool.size / 2, 0, 2 * Math.PI);
      layerContext.fill();
      
      drawAllLayers();
    }}
    onpointerleave={() => {
      coords = null;
    }}
    onpointermove={(e) => {
      const previous = coords;
      coords = { x: e.offsetX, y: e.offsetY };

      if (e.buttons === 1) {
        e.preventDefault();
        const tool = activeTool;
        const layerCanvas = getOrCreateLayerCanvas(activeLayerId);
        const layerContext = layerCanvas.getContext('2d');
        const activeLayer = layers.find(l => l.id === activeLayerId);
        
        // Override the tool's color with the layer's color
        const originalColor = tool.color;
        tool.color = activeLayer.color;
        tool.draw(tool, layerContext, previous, coords);
        tool.color = originalColor;
        
        drawAllLayers();
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