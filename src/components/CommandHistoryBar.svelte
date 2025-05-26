<script>
    export let commandHistory = [];
</script>

<div class="command-history-bar">
    {#each commandHistory as command}
        <div class="command-box">
            <div class="layer-indicator" style="background-color: {command.layer.color}"></div>
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