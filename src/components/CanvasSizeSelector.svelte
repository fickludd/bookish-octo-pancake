<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  const presets = [
    { name: 'A4', width: 2480, height: 3508, desc: 'Print (1:1.41)' },
    { name: 'Square', width: 1024, height: 1024, desc: '1:1' },
    { name: 'Instagram', width: 1080, height: 1350, desc: '4:5' },
    { name: 'Pinterest', width: 1000, height: 1500, desc: '2:3' },
    { name: 'LinkedIn', width: 1200, height: 627, desc: '1.91:1' },
    { name: 'Twitter/X', width: 1600, height: 900, desc: '16:9' },
  ];

  let customWidth = 1024;
  let customHeight = 1024;
  let showCustom = false;

  function selectPreset(preset) {
    dispatch('selectSize', { width: preset.width, height: preset.height });
  }
  function selectCustom() {
    dispatch('selectSize', { width: customWidth, height: customHeight });
  }
</script>

<div class="size-selector-bg">
  <div class="size-selector-modal">
    <h2>Select Canvas Size</h2>
    <div class="preset-grid">
      {#each presets as preset}
        <button 
          class="preset-btn" 
          on:click={() => selectPreset(preset)}
          title={`${preset.name} (${preset.width} × ${preset.height})`}
        >
          <div class="preset-name">{preset.name}</div>
          <div class="preset-desc">{preset.width} × {preset.height} <span>({preset.desc})</span></div>
        </button>
      {/each}
    </div>
    <div class="custom-row">
      <button 
        class="custom-btn" 
        on:click={() => showCustom = !showCustom}
        title="Set custom canvas dimensions"
      >
        Custom…
      </button>
      {#if showCustom}
        <div class="custom-fields">
          <input 
            type="number" 
            min="64" 
            max="8192" 
            bind:value={customWidth}
            title="Canvas width (64-8192 pixels)"
          /> ×
          <input 
            type="number" 
            min="64" 
            max="8192" 
            bind:value={customHeight}
            title="Canvas height (64-8192 pixels)"
          />
          <button 
            class="ok-btn" 
            on:click={selectCustom}
            title="Create canvas with custom dimensions"
          >
            OK
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .size-selector-bg {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(35, 39, 47, 0.97);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .size-selector-modal {
    background: var(--color-surface);
    border-radius: 16px;
    padding: 36px 36px 28px 36px;
    box-shadow: 0 6px 32px rgba(59,130,246,0.18);
    min-width: 420px;
    max-width: 90vw;
    color: var(--color-text);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h2 {
    margin-bottom: 24px;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--color-text);
  }
  .preset-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 18px;
    margin-bottom: 22px;
  }
  .preset-btn {
    background: var(--color-toolbar);
    border: none;
    border-radius: 10px;
    color: var(--color-text);
    padding: 20px 12px 14px 12px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 120px;
    min-height: 70px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    font-weight: 500;
  }
  .preset-btn:hover {
    background: var(--color-accent);
    color: #fff;
    box-shadow: 0 2px 8px rgba(59,130,246,0.13);
  }
  .preset-name {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 4px;
    color: inherit;
  }
  .preset-desc {
    font-size: 0.97rem;
    opacity: 0.85;
    color: inherit;
  }
  .preset-desc span {
    font-size: 0.87em;
    opacity: 0.7;
  }
  .custom-row {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .custom-btn {
    background: var(--color-toolbar);
    color: var(--color-text);
    border: none;
    border-radius: 8px;
    padding: 12px 28px;
    font-size: 1rem;
    cursor: pointer;
    margin-bottom: 10px;
    transition: background 0.15s, color 0.15s;
    font-weight: 600;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .custom-btn:hover {
    background: var(--color-accent);
    color: #fff;
  }
  .custom-fields {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
  }
  .custom-fields input[type="number"] {
    width: 90px;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 1rem;
    text-align: right;
    font-weight: 500;
    transition: border 0.15s;
  }
  .custom-fields input[type="number"]:focus {
    border: 1.5px solid var(--color-accent);
    outline: none;
  }
  .ok-btn {
    background: var(--color-accent);
    color: var(--color-white);
    border: none;
    border-radius: 7px;
    padding: 8px 20px;
    font-size: 1rem;
    cursor: pointer;
    margin-left: 10px;
    font-weight: 600;
    transition: background 0.15s;
    box-shadow: 0 1px 4px rgba(59,130,246,0.10);
  }
  .ok-btn:hover {
    background: var(--color-accent-hover);
  }
</style> 