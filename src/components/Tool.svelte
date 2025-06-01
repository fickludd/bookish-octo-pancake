<script>
  import { createEventDispatcher } from 'svelte';
  import SettingsModal from './SettingsModal.svelte';
  import { IconBrush, IconEraser, IconSettings } from '@tabler/icons-svelte';
  
  let { name = '', icon = '', active = false, tool, updateTool } = $props();
  let showSettings = $state(false);
  
  const dispatch = createEventDispatcher();
  
  function handleClick() {
    dispatch('click');
  }

  let IconComponent = $derived(name === 'brush' ? IconBrush : name === 'eraser' ? IconEraser : null);
</script>

<div 
  class="tool" 
  class:active 
  onclick={handleClick}
  onkeydown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabindex="0"
>
  <div class="tool-content" title={`${name.charAt(0).toUpperCase() + name.slice(1)} Tool`}>
    {#if IconComponent}
      <IconComponent class="icon" stroke={active ? 2.2 : 1.7} color={active ? 'var(--color-accent)' : 'var(--color-text-secondary)'} />
    {/if}
    <span class="name">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
  </div>
  <button class="settings-button" onclick={() => showSettings = true} stopPropagation={() => showSettings = true} title={`${name.charAt(0).toUpperCase() + name.slice(1)} Settings`}>
    <IconSettings class="icon settings-icon" stroke={1.7} color="var(--color-text-secondary)" />
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
    color: var(--color-text);
    padding: 10px 18px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background 0.18s, box-shadow 0.18s;
    box-shadow: none;
  }

  .tool:hover {
    background-color: var(--color-surface);
    box-shadow: var(--color-shadow);
  }

  .tool.active {
    background-color: var(--color-accent-selected);
    color: var(--color-white);
    box-shadow: 0 2px 8px rgba(59,130,246,0.15);
  }

  .tool-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .icon {
    width: 28px;
    height: 28px;
    display: block;
  }

  .settings-icon {
    width: 22px;
    height: 22px;
  }

  .name {
    font-size: 13px;
    text-transform: capitalize;
    font-weight: 500;
    color: inherit;
  }

  .settings-button {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    font-size: 16px;
    padding: 4px;
    cursor: pointer;
    opacity: 0.7;
    border-radius: 6px;
    transition: opacity 0.18s, background 0.18s;
  }

  .settings-button:hover {
    opacity: 1;
    background: var(--color-surface);
  }
</style> 