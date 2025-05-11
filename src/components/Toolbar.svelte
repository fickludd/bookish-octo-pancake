<script>
  import Tool from './Tool.svelte';
  
  let { activeToolName, setActiveTool, tools, updateTool } = $props();
  
  $effect(() => {
    console.log('Toolbar - Active tool changed:', activeToolName);
  });
</script>

<div class="toolbar">
  <div class="tools">
    {#each Object.values(tools) as tool}
      <Tool 
        name={tool.name}
        icon={tool.icon}
        active={activeToolName === tool.name}
        {tool}
        on:click={() => setActiveTool(tool.name)}
        {updateTool}
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