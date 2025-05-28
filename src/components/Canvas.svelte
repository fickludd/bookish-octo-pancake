<script>
  import { getOrCreateLayerCanvas, resize as resizeCanvas } from '$lib/canvasState';
  
  let { activeTool, width, height, layers, activeLayerId, addCommand, redrawTrigger } = $props();
  
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
    mainContext.clearRect(0, 0, width, height);
    
    // Draw layers in order, respecting visibility
    layers.forEach(layer => {
      if (layer.visible) {
        const { base, latest } = getOrCreateLayerCanvas(layer.id);
        // Draw the base canvas first (contains all applied commands)
        mainContext.drawImage(base, 0, 0);
        // Then draw the latest canvas on top (contains any in-progress drawing)
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

  // Redraw when redrawTrigger changes
  $effect(() => {
    redrawTrigger;
    drawAllLayers();
  });
  
  let isDrawing = false;
</script>

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