<script>
  import Tool from './Tool.svelte';
  import LayerManager from './LayerManager.svelte';
  
  let { activeToolName, setActiveTool, tools, updateTool, layers, activeLayerId, onLayerSelect, onLayerAdd, onLayerDelete, onLayerVisibilityToggle } = $props();
  
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
  <div class="right-section">
    <LayerManager
      {layers}
      {activeLayerId}
      {onLayerSelect}
      {onLayerAdd}
      {onLayerDelete}
      {onLayerVisibilityToggle}
    />
  </div>
</div>

<style>
  .toolbar {
    width: 100%;
    height: 60px;
    background-color: #34495e;
    position: fixed;
    bottom: 40px;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .tools {
    display: flex;
    gap: 8px;
  }

  .right-section {
    display: flex;
    align-items: center;
  }
</style> 