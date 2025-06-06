<script>
  import { IconEye, IconEyeOff, IconTrash, IconPlus, IconChevronUp, IconChevronDown, IconPhoto } from '@tabler/icons-svelte';
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

  function handleImportImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            // Create a new layer with the image
            const newLayer = {
              id: String(Date.now()),
              name: file.name,
              visible: true,
              type: 'image',
              image: img,
              width: img.width,
              height: img.height
            };
            onLayerAdd(newLayer);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }
</script>

<div class="layer-manager">
  <button class="layer-button" on:click={() => isOpen = !isOpen} title="Toggle Layer Panel">
    {#if isOpen}
      <IconChevronDown class="icon" stroke={2} color="var(--color-text-secondary)" />
    {:else}
      <IconChevronUp class="icon" stroke={2} color="var(--color-text-secondary)" />
    {/if}
    Layers
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
              {#if layer.visible}
                <IconEye class="icon" stroke={2} color="var(--color-text-secondary)" />
              {:else}
                <IconEyeOff class="icon" stroke={2} color="var(--color-text-secondary)" />
              {/if}
            </button>
            <span class="layer-name" on:click={() => onLayerSelect(layer.id)} title="Select Layer">
              {layer.name}
              {#if layer.type === 'image'}
                <IconPhoto class="icon small" stroke={1.5} color="var(--color-text-secondary)" />
              {/if}
            </span>
            <button 
              class="delete-button"
              on:click={() => handleDeleteLayer(layer.id)}
              disabled={layers.length <= 1}
              title={layers.length <= 1 ? 'Cannot delete the last layer' : 'Delete Layer'}
            >
              <IconTrash class="icon" stroke={2} color={layers.length <= 1 ? '#888' : 'var(--color-text-secondary)'} />
            </button>
          </div>
        {/each}
      </div>
      <div class="layer-actions">
        <button class="import-image" on:click={handleImportImage} title="Import Image as Layer">
          <IconPhoto class="icon" stroke={2} color="var(--color-white)" style="margin-right: 6px;" /> Import Image
        </button>
        <button class="add-layer" on:click={handleAddLayer} title="Add New Layer">
          <IconPlus class="icon" stroke={2.2} color="var(--color-white)" style="margin-right: 6px;" /> Add Layer
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .layer-manager {
    position: relative;
  }
  
  .layer-button {
    background: var(--color-surface);
    border: none;
    color: var(--color-text);
    padding: 8px 18px;
    cursor: pointer;
    font-size: 15px;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.15s, color 0.15s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  
  .layer-button:hover {
    background: var(--color-accent);
    color: #fff;
  }
  
  .layer-panel {
    position: absolute;
    bottom: 100%;
    right: 0;
    background-color: var(--color-surface);
    border-radius: 10px;
    padding: 14px;
    min-width: 220px;
    max-width: 320px;
    box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.22);
    margin-bottom: 10px;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 20;
  }
  
  .layer-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 14px;
  }
  
  .layer-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 10px;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.07);
    transition: background 0.13s;
  }
  
  .layer-item.active {
    background-color: var(--color-accent-selected);
    color: #fff;
  }
  
  .layer-name {
    flex: 1;
    cursor: pointer;
    color: inherit;
    font-weight: 500;
    font-size: 15px;
    letter-spacing: 0.01em;
  }
  
  .visibility-toggle,
  .delete-button {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 4px;
    opacity: 0.8;
    border-radius: 5px;
    transition: opacity 0.18s, background 0.18s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .visibility-toggle:hover,
  .delete-button:hover {
    opacity: 1;
    background: var(--color-surface);
  }
  
  .delete-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .add-layer {
    width: 100%;
    background-color: var(--color-accent);
    border: none;
    color: var(--color-white);
    padding: 10px 0;
    border-radius: 6px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    transition: background 0.15s;
    box-shadow: 0 1px 4px rgba(59,130,246,0.10);
  }
  
  .add-layer:hover {
    background-color: var(--color-accent-hover);
  }
  
  .icon {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
  }
  
  .layer-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .import-image {
    width: 100%;
    background-color: var(--color-surface);
    border: none;
    color: var(--color-white);
    padding: 10px 0;
    border-radius: 6px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    transition: background 0.15s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }

  .import-image:hover {
    background-color: var(--color-accent);
  }

  .icon.small {
    width: 16px;
    height: 16px;
    margin-left: 4px;
  }
</style> 