<script>
	import Canvas from '../components/Canvas.svelte';
	import Toolbar from '../components/Toolbar.svelte';
	import { tools as initialTools } from '$lib/tools';

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
		const newId = String(layers.length + 1);
		const colorIndex = (layers.length) % layerColors.length;
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

	$inspect(tools);
	$inspect(activeToolName);
	$inspect(activeTool);
	$inspect(layers);
	$inspect(activeLayerId);
</script>

<main>
	<Canvas {activeTool} {tools} width={canvasWidth} height={canvasHeight} {layers} {activeLayerId} />
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
	/>
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
		overflow: hidden;
		background-color: #f5f5f5;
	}
</style>
