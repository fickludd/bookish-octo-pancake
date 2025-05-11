<script>
	import Canvas from '../components/Canvas.svelte';
	import Toolbar from '../components/Toolbar.svelte';

	let canvasWidth = $state(480);
	let canvasHeight = $state(480);

	const colors = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white', 'black'];

	let activeTool = $state('brush');
  	let selected = $state(colors[0]);
  	let size = $state(10);

	function setActiveTool(tool) {
		activeTool = tool;
	}

</script>

<main>
	<Canvas activeTool={activeTool} width={canvasWidth} height={canvasHeight} />
	<Toolbar {activeTool} {setActiveTool} />
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
