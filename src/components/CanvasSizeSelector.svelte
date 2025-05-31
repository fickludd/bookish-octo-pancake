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
    background: rgba(44, 62, 80, 0.97);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .size-selector-modal {
    background: #22313a;
    border-radius: 12px;
    padding: 32px 32px 24px 32px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.25);
    min-width: 420px;
    max-width: 90vw;
    color: #ecf0f1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h2 {
    margin-bottom: 24px;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .preset-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }
  .preset-btn {
    background: #34495e;
    border: none;
    border-radius: 8px;
    color: #ecf0f1;
    padding: 18px 10px 12px 10px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.15s;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 120px;
    min-height: 70px;
  }
  .preset-btn:hover {
    background: #2980b9;
  }
  .preset-name {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 4px;
  }
  .preset-desc {
    font-size: 0.95rem;
    opacity: 0.8;
  }
  .preset-desc span {
    font-size: 0.85em;
    opacity: 0.7;
  }
  .custom-row {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .custom-btn {
    background: #34495e;
    color: #ecf0f1;
    border: none;
    border-radius: 8px;
    padding: 10px 24px;
    font-size: 1rem;
    cursor: pointer;
    margin-bottom: 8px;
    transition: background 0.15s;
  }
  .custom-btn:hover {
    background: #2980b9;
  }
  .custom-fields {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }
  .custom-fields input[type="number"] {
    width: 80px;
    padding: 4px 6px;
    border-radius: 4px;
    border: 1px solid #7f8c8d;
    background: #22313a;
    color: #ecf0f1;
    font-size: 1rem;
    text-align: right;
  }
  .ok-btn {
    background: #27ae60;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 16px;
    font-size: 1rem;
    cursor: pointer;
    margin-left: 8px;
    transition: background 0.15s;
  }
  .ok-btn:hover {
    background: #219150;
  }
</style> 