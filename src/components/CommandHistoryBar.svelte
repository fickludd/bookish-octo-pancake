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
        background-color: #1b2027; /* slightly darker than toolbar */
        display: flex;
        align-items: center;
        padding: 0 10px;
        gap: 8px;
        overflow-x: auto;
        z-index: 1;
    }

    .command-box {
        background-color: var(--color-toolbar);
        color: var(--color-white);
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 13px;
        white-space: nowrap;
        min-width: fit-content;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: background 0.18s, color 0.18s, opacity 0.18s;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }

    .command-box:hover {
        background-color: var(--color-accent);
        color: #fff;
    }

    .command-box.unapplied {
        opacity: 0.5;
    }

    .layer-indicator {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        opacity: 0.8;
        margin-right: 2px;
    }

    .command-label {
        opacity: 0.92;
        font-weight: 500;
        letter-spacing: 0.01em;
    }
</style> 