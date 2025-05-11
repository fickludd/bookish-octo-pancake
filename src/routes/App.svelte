<script>
	import Canvas from '../components/Canvas.svelte';
	import Toolbar from '../components/Toolbar.svelte';
	import { tools as initialTools } from '$lib/tools';

	let canvasWidth = $state(480);
	let canvasHeight = $state(480);

	let tools = $state(initialTools);
	let activeToolName = $state('brush');
	let activeTool = $derived(tools[activeToolName]);

	$inspect(tools);
	$inspect(activeToolName);
	$inspect(activeTool);

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
</script>

<main>
	<Canvas {activeTool} {tools} width={canvasWidth} height={canvasHeight} />
	<Toolbar 
		{activeToolName} 
		setActiveTool={setActiveTool} 
		{tools}
		{updateTool}
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
