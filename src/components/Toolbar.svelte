<script>
  import Tool from './Tool.svelte';
  
  let { activeTool = 'brush' } = $props();

  function setActiveTool(tool) {
    activeTool = tool;
  }

  $effect(() => {
    console.log('Active tool changed:', activeTool);
  });
</script>

<div class="toolbar">
  <div class="tools">
    <Tool 
      name="brush" 
      icon="🖌️" 
      active={activeTool === 'brush'} 
      on:click={() => setActiveTool('brush')}
    />
    <Tool 
      name="eraser" 
      icon="🧹" 
      active={activeTool === 'eraser'} 
      on:click={() => setActiveTool('eraser')}
    />
  </div>
</div>

<style>
  .toolbar {
    width: 100%;
    height: 60px;
    background-color: #34495e;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .tools {
    display: flex;
    gap: 8px;
  }
</style> 