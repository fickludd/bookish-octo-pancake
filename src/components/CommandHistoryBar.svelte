<script>
    export let commandHistory = [];
    export let currentCommandIndex = -1;
    export let onCommandClick = (index) => {};

    function handleCommandClick(index) {
        onCommandClick(index);
    }
</script>

<div class="command-history-bar">
    {#each commandHistory as command, index}
        <div 
            class="command-box" 
            class:unapplied={index > currentCommandIndex}
            on:click={() => handleCommandClick(index)}
            title={`${command.label} on ${command.layer.name}${index > currentCommandIndex ? ' (not applied)' : ''}`}
        >
            <div class="layer-indicator" style="background-color: {command.layer.color}" title={command.layer.name}></div>
            <span class="command-label">{command.label}</span>
        </div>
    {/each}
</div>

<style>
    .command-history-bar {
        position: fixed;
        bottom: 0px;
        left: 0;
        right: 0;
        width: 100%;
        height: 40px;
        background-color: #2c3e50;
        display: flex;
        align-items: center;
        padding: 0 10px;
        gap: 8px;
        overflow-x: auto;
        z-index: 1;
    }

    .command-box {
        background-color: #34495e;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        min-width: fit-content;
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition: opacity 0.2s;
    }

    .command-box:hover {
        background-color: #2c3e50;
    }

    .command-box.unapplied {
        opacity: 0.5;
    }

    .layer-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        opacity: 0.7;
    }

    .command-label {
        opacity: 0.9;
    }
</style> 