<script>
    import { flip } from 'svelte/animate';
    import { send, receive } from '$lib/transition.js';
    import { IconBrush, IconEraser } from '@tabler/icons-svelte';
    
    let { commandHistory, currentCommandNbr, onCommandClick } = $props();

    function handleCommandClick(index) {
        onCommandClick(index);
    }

    function getIconComponent(toolName) {
        return toolName === 'brush' ? IconBrush : toolName === 'eraser' ? IconEraser : IconBrush;
    }
</script>

<div class="command-history-bar">
    {#each commandHistory as command (command.nbr)}
        <div 
            in:receive={{ key: command.nbr }} 
            out:send={{ key: command.nbr }} 
            animate:flip={{ duration: 100 }}
        >
          <button 
                class="command-box" 
                class:unapplied={command.nbr > currentCommandNbr}
                onclick={() => handleCommandClick(command.nbr)}
                onkeydown={(e) => e.key === 'Enter' && handleCommandClick(command.nbr)}
                onkeyup={(e) => e.key === ' ' && handleCommandClick(command.nbr)}
                title={`${command.label} on ${command.layer.name}${command.nbr > currentCommandNbr ? ' (not applied)' : ''}`}
            >
                {#if command.tool}
                    {@const IconComponent = getIconComponent(command.tool.name)}
                    <IconComponent 
                        class="tool-icon" 
                        stroke={1.7} 
                        color={command.layer.color} 
                    />
                {:else}
                    <IconBrush class="tool-icon" stroke={1.7} color={command.layer.color} />
                {/if}
            </button>
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
        padding: 8px;
        border-radius: 6px;
        font-size: 16px;
        white-space: nowrap;
        min-width: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.18s, color 0.18s, opacity 0.18s;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        width: 36px;
        height: 36px;
        border: none;
        outline: none;
    }

    .command-box:hover {
        background-color: var(--color-accent);
        color: #fff;
    }

    .command-box.unapplied {
        opacity: 0.5;
    }

    .tool-icon {
        width: 18px;
        height: 18px;
        opacity: 0.92;
    }
</style> 