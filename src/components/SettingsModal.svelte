<script>
  let { tool, updateTool, onClose } = $props();
  
  function handleClickOutside(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleSizeChange(e) {
    const newSize = parseInt(e.target.value);
    updateTool(tool.name, { size: newSize });
  }
</script>

<div class="modal-backdrop" on:click={handleClickOutside}>
  <div class="modal">
    <div class="modal-header">
      <h3>{tool.name} Settings</h3>
      <button class="close-button" on:click={onClose}>×</button>
    </div>
    <div class="modal-content">
      <div class="setting">
        <label for="size">Size</label>
        <input 
          type="range" 
          id="size" 
          min="1" 
          max="50" 
          value={tool.size}
          on:input={handleSizeChange}
        />
        <span class="size-value">{tool.size}px</span>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background-color: #2c3e50;
    border-radius: 8px;
    padding: 20px;
    min-width: 300px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .modal-header h3 {
    margin: 0;
    color: #ecf0f1;
    text-transform: capitalize;
  }

  .close-button {
    background: none;
    border: none;
    color: #ecf0f1;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .setting {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #ecf0f1;
  }

  input[type="range"] {
    flex: 1;
    height: 4px;
    -webkit-appearance: none;
    background: #34495e;
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

  .size-value {
    min-width: 50px;
    text-align: right;
  }
</style> 