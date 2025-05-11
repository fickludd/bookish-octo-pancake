<script>
  import { createEventDispatcher } from 'svelte';
  
  export let name = '';
  export let icon = '';
  export let active = false;
  
  const dispatch = createEventDispatcher();
  
  function handleClick() {
    dispatch('click');
  }
</script>

<button class="tool" class:active on:click={handleClick}>
  <span class="icon">{icon}</span>
  <span class="name">{name}</span>
</button>

<style>
  .tool {
    background: none;
    border: none;
    color: #ecf0f1;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transition: background-color 0.2s;
  }

  .tool:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .tool.active {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .icon {
    font-size: 24px;
  }

  .name {
    font-size: 12px;
    text-transform: capitalize;
  }
</style> 