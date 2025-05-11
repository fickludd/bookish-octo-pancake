<script>
  import { createEventDispatcher } from 'svelte';
  import SettingsModal from './SettingsModal.svelte';
  
  let { name = '', icon = '', active = false, tool, updateTool } = $props();
  let showSettings = $state(false);
  
  const dispatch = createEventDispatcher();
  
  function handleClick() {
    dispatch('click');
  }
</script>

<div class="tool" class:active>
  <div class="tool-content" on:click>
    <span class="icon">{icon}</span>
    <span class="name">{name}</span>
  </div>
  <button class="settings-button" on:click|stopPropagation={() => showSettings = true}>
    ⚙️
  </button>
</div>

{#if showSettings}
  <SettingsModal 
    {tool} 
    {updateTool}
    onClose={() => showSettings = false} 
  />
{/if}

<style>
  .tool {
    background: none;
    border: none;
    color: #ecf0f1;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s;
  }

  .tool:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .tool.active {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .tool-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .icon {
    font-size: 24px;
  }

  .name {
    font-size: 12px;
    text-transform: capitalize;
  }

  .settings-button {
    background: none;
    border: none;
    color: #ecf0f1;
    font-size: 16px;
    padding: 4px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .settings-button:hover {
    opacity: 1;
  }
</style> 