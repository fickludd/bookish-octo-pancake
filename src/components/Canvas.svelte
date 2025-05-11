<script>
  import { onMount } from 'svelte';
  
  let { color = 'black', size = 10, activeTool = 'brush', width = 1200, height = 800} = $props();

  let canvas = $state();
  let context = $state();
  let coords = $state();

	$effect(() => {
		context = canvas.getContext('2d');
		resize();
	});

	function resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
  
  let isDrawing = false;
</script>


<svelte:window onresize={resize} />

<div class="canvas-container">
  <canvas
    bind:this={canvas}
    onpointerdown={(e) => {
      coords = { x: e.offsetX, y: e.offsetY };

      context.fillStyle = color;
      context.beginPath();
      context.arc(coords.x, coords.y, size / 2, 0, 2 * Math.PI);
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

        context.strokeStyle = color;
        context.lineWidth = size;
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(previous.x, previous.y);
        context.lineTo(coords.x, coords.y);
        context.stroke();
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