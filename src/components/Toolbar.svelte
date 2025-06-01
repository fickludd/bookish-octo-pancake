<script>
  import Tool from './Tool.svelte';
  import LayerManager from './LayerManager.svelte';
  import { saveCanvasState, loadCanvasState } from '$lib/canvasState';
  import { onMount, onDestroy } from 'svelte';
  import { IconFolder, IconMinus, IconPlus, IconRefresh } from '@tabler/icons-svelte';
  
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
        <IconFolder class="icon" stroke={1.7} color="var(--color-text-secondary)" />
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
    <button class="tool-button" on:click={zoomOut} title="Zoom out (Ctrl + -)">
      <IconMinus class="icon" stroke={2} color="var(--color-text-secondary)" />
    </button>
    <span class="zoom-label" title="Current zoom level">{Math.round(zoom * 100)}%</span>
    <button class="tool-button" on:click={zoomIn} title="Zoom in (Ctrl + +)">
      <IconPlus class="icon" stroke={2} color="var(--color-text-secondary)" />
    </button>
    <button class="tool-button" on:click={resetZoom} title="Reset zoom to 100%">
      <IconRefresh class="icon" stroke={2} color="var(--color-text-secondary)" />
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
    height: 64px;
    background-color: var(--color-toolbar);
    position: fixed;
    bottom: 40px;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.10);
    overflow: visible;
    gap: 24px;
    z-index: 100;
  }

  .tools {
    display: flex;
    gap: 12px;
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
    gap: 16px;
    padding: 0 14px;
    background-color: var(--color-surface);
    border-radius: 8px;
    flex-shrink: 0;
    box-shadow: var(--color-shadow);
  }

  .color-picker {
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background: var(--color-bg);
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }

  .color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  .color-picker::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }

  .sliders {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .slider-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .slider-group label {
    color: var(--color-text-secondary);
    font-size: 13px;
    min-width: 40px;
    font-weight: 500;
  }

  input[type="range"] {
    width: 110px;
    height: 6px;
    -webkit-appearance: none;
    background: var(--color-border);
    border-radius: 3px;
    outline: none;
    transition: background 0.2s;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: var(--color-accent);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(59,130,246,0.10);
    border: 2px solid var(--color-bg);
    transition: background 0.2s, border 0.2s;
  }

  .file-actions {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
    align-items: center;
  }

  .tool-button {
    background: var(--color-surface);
    border: none;
    border-radius: 6px;
    padding: 7px 10px;
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: background 0.15s, color 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }

  .tool-button:hover {
    background: var(--color-accent);
    color: var(--color-white);
  }

  .icon {
    width: 22px;
    height: 22px;
    display: block;
  }

  .zoom-label {
    color: var(--color-text);
    font-size: 1rem;
    margin: 0 8px;
    min-width: 40px;
    text-align: center;
    user-select: none;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .file-menu {
    position: relative;
  }

  .file-dropdown {
    position: absolute;
    bottom: 100%;
    left: 0;
    background-color: var(--color-surface);
    border-radius: 8px;
    padding: 10px 0;
    min-width: 170px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
    margin-bottom: 10px;
    z-index: 10;
  }

  .file-dropdown button {
    display: block;
    width: 100%;
    padding: 10px 18px;
    border: none;
    background: none;
    color: var(--color-text);
    text-align: left;
    cursor: pointer;
    font-size: 15px;
    border-radius: 0;
    transition: background 0.13s, color 0.13s;
  }

  .file-dropdown button:hover {
    background-color: var(--color-accent);
    color: var(--color-white);
  }

  .separator {
    height: 1px;
    background-color: var(--color-border);
    margin: 10px 0;
  }
</style> 