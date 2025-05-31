<script>
  import Tool from './Tool.svelte';
  import LayerManager from './LayerManager.svelte';
  import { saveCanvasState, loadCanvasState } from '$lib/canvasState';
  import { onMount, onDestroy } from 'svelte';
  
  let { activeToolName, setActiveTool, tools, updateTool, layers, activeLayerId, onLayerSelect, onLayerAdd, onLayerDelete, onLayerVisibilityToggle, onLoadComplete, onCanvasSizeChange, zoom, zoomIn, zoomOut, resetZoom } = $props();
  
  let showFileMenu = $state(false);
  
  $effect(() => {
    console.log('Toolbar - Active tool changed:', activeToolName);
  });

  function handleColorChange(event) {
    if (activeToolName === 'brush') {
      updateTool('brush', { color: event.target.value });
    }
  }

  function handleOpacityChange(event) {
    if (activeToolName === 'brush') {
      updateTool('brush', { opacity: parseFloat(event.target.value) / 100.0 });
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
    showFileMenu = false;
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
          onCanvasSizeChange(state.width, state.height);
          await loadCanvasState(state);
          onLoadComplete();
        };
        reader.readAsText(file);
      }
    };
    input.click();
    showFileMenu = false;
  }

  function handleExportPNG() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'canvas-export.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showFileMenu = false;
  }

  function handleExportJPEG() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'canvas-export.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
    showFileMenu = false;
  }

  function handleClickOutside(event) {
    if (!event.target.closest('.file-menu')) {
      showFileMenu = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
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
        title={tool.name.charAt(0).toUpperCase() + tool.name.slice(1)}
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
        title="Brush Color"
      />
      <div class="sliders">
        <div class="slider-group">
          <label>Size</label>
          <input 
            type="range" 
            min="1" 
            max="50" 
            value={tools.brush.size}
            on:input={(e) => updateTool('brush', { size: parseInt(e.target.value) })}
            title="Brush Size"
          />
        </div>
        <div class="slider-group">
          <label>Opacity</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={tools.brush.opacity * 100}
            on:input={handleOpacityChange}
            title="Brush Opacity"
          />
        </div>
      </div>
    </div>
  {/if}

  <div class="file-actions">
    <div class="file-menu">
      <button class="tool-button" on:click={() => showFileMenu = !showFileMenu} title="File operations">
        📁
      </button>
      {#if showFileMenu}
        <div class="file-dropdown">
          <button on:click={handleSave} title="Save your current project">Save Project</button>
          <button on:click={handleLoad} title="Load a previously saved project">Load Project</button>
          <div class="separator"></div>
          <button on:click={handleExportPNG} title="Export canvas as PNG image">Export as PNG</button>
          <button on:click={handleExportJPEG} title="Export canvas as JPEG image">Export as JPEG</button>
        </div>
      {/if}
    </div>
    <button class="tool-button" on:click={zoomOut} title="Zoom out (Ctrl + -)">-</button>
    <span class="zoom-label" title="Current zoom level">{Math.round(zoom * 100)}%</span>
    <button class="tool-button" on:click={zoomIn} title="Zoom in (Ctrl + +)">+</button>
    <button class="tool-button" on:click={resetZoom} title="Reset zoom to 100%">⟳</button>
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
    overflow: visible;
    gap: 20px;
  }

  .tools {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  .right-section {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: 20px;
  }

  .tool-options {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
    background-color: #34495e;
    border-radius: 4px;
    flex-shrink: 0;
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

  .sliders {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .slider-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .slider-group label {
    color: #ecf0f1;
    font-size: 12px;
    min-width: 40px;
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
    flex-shrink: 0;
    align-items: center;
  }

  .zoom-label {
    color: #ecf0f1;
    font-size: 1rem;
    margin: 0 6px;
    min-width: 40px;
    text-align: center;
    user-select: none;
  }

  .file-menu {
    position: relative;
  }

  .file-dropdown {
    position: absolute;
    bottom: 100%;
    left: 0;
    background-color: #2c3e50;
    border-radius: 4px;
    padding: 8px 0;
    min-width: 160px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    margin-bottom: 8px;
  }

  .file-dropdown button {
    display: block;
    width: 100%;
    padding: 8px 16px;
    border: none;
    background: none;
    color: #ecf0f1;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
  }

  .file-dropdown button:hover {
    background-color: #34495e;
  }

  .separator {
    height: 1px;
    background-color: #34495e;
    margin: 8px 0;
  }
</style> 