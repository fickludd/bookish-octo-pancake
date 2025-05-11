<script>
	import Canvas from '../components/Canvas.svelte';
	import Toolbar from '../components/Toolbar.svelte';

	const canvasWidth = 1200;
	const canvasHeight = 800;

	const colors = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'white', 'black'];

	let activeTool = $state('brush');
  	let selected = $state(colors[0]);
  	let size = $state(10);
</script>

<main>
	<Canvas width={canvasWidth} height={canvasHeight} size={size} color={selected} activeTool={activeTool} />
	<Toolbar activeTool={activeTool} />
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
