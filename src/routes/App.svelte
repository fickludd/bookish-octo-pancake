<script>
	import Canvas from '../components/Canvas.svelte';
	import Toolbar from '../components/Toolbar.svelte';
	import CommandHistoryBar from '../components/CommandHistoryBar.svelte';
	import CanvasSizeSelector from '../components/CanvasSizeSelector.svelte';
	import { tools as initialTools } from '$lib/tools';
	import { replayCommands, resize, getOrCreateLayerCanvas } from '$lib/canvasState';
	import { onMount, onDestroy } from 'svelte';

	let canvasWidth = $state();
	let canvasHeight = $state();
	let canvasInitialized = $state(false);

	let tools = $state(initialTools);
	let activeToolName = $state('brush');
	let activeTool = $derived(tools[activeToolName]);

	// Layer management
	const layerColors = [
		'#FF6B6B', // Coral Red
		'#4ECDC4', // Turquoise
		'#45B7D1', // Sky Blue
		'#96CEB4', // Sage Green
		'#FFEEAD', // Cream
		'#D4A5A5', // Dusty Rose
		'#9B59B6', // Purple
		'#3498DB', // Blue
		'#2ECC71', // Green
		'#F1C40F'  // Yellow
	];

	let layers = $state([
		{ id: '1', name: 'Layer 1', visible: true, color: layerColors[0] }
	]);
	let activeLayerId = $state('1');
	let layerNextId = 2;

	// Command history with max size
	const HISTORY_LIMIT = 3; // Maximum number of commands to keep in memory
	let commandHistory = $state([]);
	let currentCommandIndex = $state(-1);
	let historyOffset = $state(0); // Offset to the first command in the circular buffer
	let redrawTrigger = $state(0);

	let zoom = $state(1);
	let pan = $state({ x: 0, y: 0 });

	$effect(() => {
		resize(canvasWidth, canvasHeight);
	});

	function setActiveTool(toolName) {
		activeToolName = toolName;
	}

	function updateTool(toolName, updates) {
		tools = {
			...tools,
			[toolName]: {
				...tools[toolName],
				...updates
			}
		};
	}

	function handleLayerSelect(layerId) {
		activeLayerId = layerId;
	}

	function handleLayerAdd(newLayer) {
		if (newLayer) {
			// If a new layer is provided (e.g., for image import), use it
			layers = [...layers, newLayer];
			activeLayerId = newLayer.id;
		} else {
			// Create a new regular layer
			const newIdInt = layerNextId++;
			const newId = String(newIdInt);
			const colorIndex = (newIdInt) % layerColors.length;
			layers = [...layers, { 
				id: newId, 
				name: `Layer ${newId}`, 
				visible: true,
				color: layerColors[colorIndex]
			}];
			activeLayerId = newId;
		}
	}

	function handleLayerDelete(layerId) {
		if (layers.length <= 1) return;
		layers = layers.filter(layer => layer.id !== layerId);
		if (activeLayerId === layerId) {
			activeLayerId = layers[0].id;
		}
	}

	function handleLayerVisibilityToggle(layerId) {
		layers = layers.map(layer => 
			layer.id === layerId 
				? { ...layer, visible: !layer.visible }
				: layer
		);
	}

	function handleCommandClick(index) {
		if (index === currentCommandIndex) {
			// If clicking the current command, rewind to before it
			rewindToCommand(index - 1);
		} else if (index < currentCommandIndex) {
			// If clicking a command before current, rewind to it
			rewindToCommand(index);
		} else {
			// If clicking a command after current, forward to it
			forwardToCommand(index);
		}
	}

	function rewindToCommand(targetIndex) {
		replayCommands(commandHistory, 0, targetIndex);
		currentCommandIndex = targetIndex;
		redrawTrigger++;
	}

	function forwardToCommand(targetIndex) {
		replayCommands(commandHistory, currentCommandIndex + 1, targetIndex);
		currentCommandIndex = targetIndex;
		redrawTrigger++;
	}

	function undo() {
		if (currentCommandIndex >= 0) {
			rewindToCommand(currentCommandIndex - 1);
		}
	}

	function redo() {
		if (currentCommandIndex < commandHistory.length - 1) {
			forwardToCommand(currentCommandIndex + 1);
		}
	}

	function handleKeyDown(e) {
		// Undo: Ctrl+Z
		if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
			e.preventDefault();
			undo();
		}
		// Redo: Ctrl+Y or Ctrl+Shift+Z
		if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
			e.preventDefault();
			redo();
		}
	}

	function addCommand(command) {
		if (command) {
			// Discard any commands after the current index
			const appliedHistory = commandHistory.slice(0, currentCommandIndex + 1);
			commandHistory = [...appliedHistory, command];

			// If history is full, commit the oldest command to base canvas
			if (commandHistory.length > HISTORY_LIMIT) {
				const oldestCommand = commandHistory[0];
				const { base } = getOrCreateLayerCanvas(oldestCommand.layer.id);
				const baseContext = base.getContext('2d');
				oldestCommand.applyCommand(oldestCommand, baseContext);
				
				// Remove oldest command and update offset
				commandHistory = commandHistory.slice(1);
				historyOffset++;
			}
			
			// Add new command
			currentCommandIndex = commandHistory.length - 1;
		}
	}

	function handleLoadComplete() {
		// Clear command history
		commandHistory = [];
		currentCommandIndex = -1;
		historyOffset = 0;
		redrawTrigger++;
	}

	function handleCanvasSizeSelected(width, height) {
		canvasWidth = width;
		canvasHeight = height;
		canvasInitialized = true;
	}

	function setZoom(newZoom) {
		zoom = Math.max(0.1, Math.min(newZoom, 10));
	}
	function zoomIn() {
		setZoom(zoom * 1.5);
	}
	function zoomOut() {
		setZoom(zoom / 1.5);
	}
	function resetZoom() {
		zoom = 1;
		pan = { x: 0, y: 0 };
	}
	function setPan(newPan) { // canvas space
		pan = newPan;
	}

	$inspect(activeToolName);
	$inspect(activeLayerId);

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeyDown);
	});
</script>

<main>
	{#if !canvasInitialized}
		<CanvasSizeSelector on:selectSize={(e) => handleCanvasSizeSelected(e.detail.width, e.detail.height)} />
	{:else}
		<Canvas 
			{activeTool}
			width={canvasWidth} 
			height={canvasHeight} 
			{layers} 
			{activeLayerId} 
			{addCommand}
			{redrawTrigger}
			{zoom}
			{pan}
			setPan={setPan}
		/>
		<Toolbar 
			{activeToolName} 
			setActiveTool={setActiveTool} 
			{tools}
			{updateTool}
			{layers}
			{activeLayerId}
			onLayerSelect={handleLayerSelect}
			onLayerAdd={handleLayerAdd}
			onLayerDelete={handleLayerDelete}
			onLayerVisibilityToggle={handleLayerVisibilityToggle}
			onLoadComplete={handleLoadComplete}
			onCanvasSizeChange={handleCanvasSizeSelected}
			{zoom}
			{zoomIn}
			{zoomOut}
			{resetZoom}
			{commandHistory}
			{currentCommandIndex}
			onUndo={undo}
			onRedo={redo}
		/>
		<div class="zoom-indicator" on:click={resetZoom} title="Reset zoom">
			{Math.round(zoom * 100)}%
		</div>
		<CommandHistoryBar 
			{commandHistory} 
			{currentCommandIndex}
			onCommandClick={handleCommandClick}
		/>
	{/if}
</main>

<style>
	:global(html) {
		font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
		--color-bg: #23272f;
		--color-surface: #2d323b;
		--color-toolbar: #232c3b;
		--color-canvas-bg: #888;
		--color-accent-selected: #3b5286;
		--color-accent: #3b82f6;
		--color-accent-hover: #2563eb;
		--color-border: #3b4252;
		--color-text: #e5e7eb;
		--color-text-secondary: #b0b8c1;
		--color-white: #fff;
		--color-black: #000;
		--color-disabled: #888;
		--color-shadow: 0 2px 8px rgba(59,130,246,0.08);
		--color-shadow-strong: 0 6px 32px rgba(59,130,246,0.18);
		--color-shadow-toolbar: 0 -2px 12px rgba(0, 0, 0, 0.10);
		--color-shadow-panel: 0 -2px 16px rgba(0, 0, 0, 0.22);
		--color-shadow-subtle: 0 1px 4px rgba(0,0,0,0.08);
		--color-shadow-accent: 0 2px 8px rgba(59,130,246,0.13);
		--color-shadow-accent-light: 0 1px 4px rgba(59,130,246,0.10);
	}
	main {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
		overflow: hidden;
		background-color: var(--color-bg);
		color: var(--color-text);
	}
	.zoom-indicator {
		position: fixed;
		top: 16px;
		right: 32px;
		background: var(--color-toolbar);
		color: var(--color-text);
		padding: 6px 16px;
		border-radius: 20px;
		font-size: 1.0rem;
		font-weight: 500;
		box-shadow: var(--color-shadow);
		cursor: pointer;
		z-index: 1001;
		user-select: none;
		transition: background 0.15s;
	}
	.zoom-indicator:hover {
		background: var(--color-accent);
		color: var(--color-white);
	}
</style>
