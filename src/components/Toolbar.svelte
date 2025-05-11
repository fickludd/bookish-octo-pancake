<script>
  import Tool from './Tool.svelte';
  import { tools } from '$lib/tools';
  
  let { activeTool, setActiveTool } = $props();
  
  $effect(() => {
    console.log('Toolbar - Active tool changed:', activeTool);
  });
</script>

<div class="toolbar">
  <div class="tools">
    {#each Object.values(tools) as tool}
      <Tool 
        name={tool.name}
        icon={tool.icon}
        active={activeTool === tool.name}
        on:click={() => {setActiveTool(tool.name);}}
      />
    {/each}
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