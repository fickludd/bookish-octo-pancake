<script>
	import Canvas from '../components/Canvas.svelte';
	import Toolbar from '../components/Toolbar.svelte';
	import CommandHistoryBar from '../components/CommandHistoryBar.svelte';
	import { tools as initialTools } from '$lib/tools';
	import { replayCommands, resize } from '$lib/canvasState';

	let canvasWidth = $state(480);
	let canvasHeight = $state(480);

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

	let commandHistory = $state([])
	let currentCommandIndex = $state(-1);
	let redrawTrigger = $state(0);

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

	function handleLayerAdd() {
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

	function addCommand(command) {
		if (command) {
			// Discard any commands after the current index
			const appliedHistory = commandHistory.slice(0, currentCommandIndex + 1);
			commandHistory = [...appliedHistory, command];
			currentCommandIndex = commandHistory.length - 1;
		}
	}

	// Handle load completion
	function handleLoadComplete() {
		// Clear command history
		commandHistory = [];
		currentCommandIndex = -1;
		redrawTrigger++;
	}

	$inspect(activeToolName);
	$inspect(activeLayerId);
</script>

<main>
	<Canvas 
		{activeTool}
		width={canvasWidth} 
		height={canvasHeight} 
		{layers} 
		{activeLayerId} 
		{addCommand}
		{redrawTrigger}
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
	/>
	<CommandHistoryBar 
		{commandHistory} 
		{currentCommandIndex}
		onCommandClick={handleCommandClick}
	/>
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
		overflow: hidden;
		background-color: #2c3e50;
	}
</style>
