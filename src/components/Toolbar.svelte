<script>
  import Tool from './Tool.svelte';
  import LayerManager from './LayerManager.svelte';
  import { saveCanvasState, loadCanvasState } from '$lib/canvasState';
  
  let { activeToolName, setActiveTool, tools, updateTool, layers, activeLayerId, onLayerSelect, onLayerAdd, onLayerDelete, onLayerVisibilityToggle, onLoadComplete } = $props();
  
  $effect(() => {
    console.log('Toolbar - Active tool changed:', activeToolName);
  });

  function handleColorChange(event) {
    if (activeToolName === 'brush') {
      updateTool('brush', { color: event.target.value });
    }
  }

  function handleSave() {
    const state = saveCanvasState();
    const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas-state.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleLoad() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const state = JSON.parse(event.target.result);
          await loadCanvasState(state);
          onLoadComplete();
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
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

  {#if activeToolName === 'brush'}
    <div class="tool-options">
      <input 
        type="color" 
        value={tools.brush.color}
        on:change={handleColorChange}
        class="color-picker"
      />
      <input 
        type="range" 
        min="1" 
        max="50" 
        value={tools.brush.size}
        on:input={(e) => updateTool('brush', { size: parseInt(e.target.value) })}
      />
    </div>
  {/if}

  <div class="file-actions">
    <button class="tool-button" on:click={handleSave} title="Save">
      💾
    </button>
    <button class="tool-button" on:click={handleLoad} title="Load">
      📂
    </button>
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

  .tool-options {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
    background-color: #34495e;
    border-radius: 4px;
  }

  .color-picker {
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  .color-picker::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }

  input[type="range"] {
    width: 100px;
    height: 4px;
    -webkit-appearance: none;
    background: #7f8c8d;
    border-radius: 2px;
    outline: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #3498db;
    border-radius: 50%;
    cursor: pointer;
  }

  .file-actions {
    display: flex;
    gap: 10px;
    margin-left: 20px;
  }
</style> 