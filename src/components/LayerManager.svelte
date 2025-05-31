<script>
  let { layers, activeLayerId, onLayerSelect, onLayerAdd, onLayerDelete, onLayerVisibilityToggle } = $props();
  
  let isOpen = $state(false);
  
  function handleAddLayer() {
    onLayerAdd();
  }
  
  function handleDeleteLayer(layerId) {
    onLayerDelete(layerId);
  }
  
  function handleVisibilityToggle(layerId) {
    onLayerVisibilityToggle(layerId);
  }
</script>

<div class="layer-manager">
  <button class="layer-button" on:click={() => isOpen = !isOpen} title="Toggle Layer Panel">
    {isOpen ? '▼' : '▲'} Layers
  </button>
  
  {#if isOpen}
    <div class="layer-panel">
      <div class="layer-list">
        {#each layers as layer (layer.id)}
          <div class="layer-item" class:active={layer.id === activeLayerId}>
            <button 
              class="visibility-toggle"
              on:click={() => handleVisibilityToggle(layer.id)}
              title={layer.visible ? 'Hide Layer' : 'Show Layer'}
            >
              {layer.visible ? '👁️' : '👁️‍🗨️'}
            </button>
            <span class="layer-name" on:click={() => onLayerSelect(layer.id)} title="Select Layer">
              {layer.name}
            </span>
            <button 
              class="delete-button"
              on:click={() => handleDeleteLayer(layer.id)}
              disabled={layers.length <= 1}
              title={layers.length <= 1 ? 'Cannot delete the last layer' : 'Delete Layer'}
            >
              🗑️
            </button>
          </div>
        {/each}
      </div>
      <button class="add-layer" on:click={handleAddLayer} title="Add New Layer">
        + Add Layer
      </button>
    </div>
  {/if}
</div>

<style>
  .layer-manager {
    position: relative;
  }
  
  .layer-button {
    background: none;
    border: none;
    color: #ecf0f1;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .layer-panel {
    position: absolute;
    bottom: 100%;
    right: 0;
    background-color: #2c3e50;
    border-radius: 8px;
    padding: 12px;
    min-width: 200px;
    max-width: 300px;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    margin-bottom: 8px;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .layer-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .layer-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .layer-item.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .layer-name {
    flex: 1;
    cursor: pointer;
    color: #ecf0f1;
  }
  
  .visibility-toggle,
  .delete-button {
    background: none;
    border: none;
    color: #ecf0f1;
    cursor: pointer;
    padding: 4px;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  
  .visibility-toggle:hover,
  .delete-button:hover {
    opacity: 1;
  }
  
  .delete-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .add-layer {
    width: 100%;
    background-color: #3498db;
    border: none;
    color: white;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .add-layer:hover {
    background-color: #2980b9;
  }
</style> 