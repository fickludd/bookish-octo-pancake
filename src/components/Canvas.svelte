<script>
  
  let { activeTool, tools, width, height } = $props();
  
  let canvas = $state();
  let context = $state();
  let coords = $state();
  
  $effect(() => {
    context = canvas.getContext('2d');
    resize();
  });
  
  function resize() {
    canvas.width = width;
    canvas.height = height;
  }
  
  let isDrawing = false;
</script>


<!--svelte:window onresize={resize} /-->

<div class="canvas-container">
  <canvas
    bind:this={canvas}
    onpointerdown={(e) => {
      coords = { x: e.offsetX, y: e.offsetY };
      const tool = activeTool;
      console.log('Canvas - Using tool:', tool);
      // Draw initial point
      context.fillStyle = tool.color;
      context.beginPath();
      context.arc(coords.x, coords.y, tool.size / 2, 0, 2 * Math.PI);
      context.fill();
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
        tool.draw(tool,context, previous, coords);
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
  }

  canvas {
    background-color: #908383;
    cursor: crosshair;
  }
</style> 