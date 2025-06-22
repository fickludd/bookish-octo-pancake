// State
let layerCanvases = new Map();
let width = 480;
let height = 480;

// Functions
export function getOrCreateLayerCanvas(layerId) {
  if (!layerCanvases.has(layerId)) {
    const baseCanvas = createLayerCanvas();
    const latestCanvas = createLayerCanvas();
    layerCanvases.set(layerId, {base: baseCanvas, latest: latestCanvas});
  }
  return layerCanvases.get(layerId);
}

function createLayerCanvas() {
  const layerCanvas = document.createElement('canvas');
  layerCanvas.width = width;
  layerCanvas.height = height;
  layerCanvas.style.position = 'absolute';
  layerCanvas.style.pointerEvents = 'none';
  return layerCanvas;
}

export function clearCanvases() {
  layerCanvases.forEach(({base, latest}) => {
    const baseContext = base.getContext('2d');
    const latestContext = latest.getContext('2d');
    baseContext.clearRect(0, 0, width, height);
    latestContext.clearRect(0, 0, width, height);
  });
}

export function replayCommands(commands, startIndex, endIndex) {
  // First, copy the base state to the latest canvas for each layer
  layerCanvases.forEach(({base, latest}) => {
    const baseContext = base.getContext('2d');
    const latestContext = latest.getContext('2d');
    latestContext.clearRect(0, 0, width, height);
    latestContext.drawImage(base, 0, 0);
  });

  // Then replay commands on top of the latest canvas
  for (let i = 0; i <= endIndex; i++) {
    const command = commands[i];
    const {latest} = getOrCreateLayerCanvas(command.layer.id);
    const latestContext = latest.getContext('2d');
    command.applyCommand(command, latestContext);
  }
}

export function resize(newWidth, newHeight) {
  width = newWidth;
  height = newHeight;
  
  // Resize all layer canvases
  layerCanvases.forEach(({base, latest}) => {
    base.width = width;
    base.height = height;
    latest.width = width;
    latest.height = height;
  });
}

export function saveCanvasState() {
  const state = {
    width,
    height,
    layers: Array.from(layerCanvases.entries()).map(([layerId, {latest, image, type}]) => ({
      layerId,
      image: (latest ? latest : image).toDataURL(),
      type: type,
    }))
  };
  return state;
}

export function loadCanvasState(state) {
  // Clear existing state
  clearCanvases();
  
  resize(state.width, state.height);
  
  // Create a promise for each layer's loading
  const loadPromises = state.layers.map(({layerId, type, image}) => {
    return new Promise((resolve) => {
      const {base, image, latest} = getOrCreateLayerCanvas(layerId);
      
      // Load base image
      const baseImg = new Image();
      baseImg.onload = () => {
        const ctx = base.getContext('2d');
        ctx.drawImage(baseImg, 0, 0);
        resolve();
      };
      baseImg.src = image;
    });
  });

  // Wait for all layers to load
  return Promise.all(loadPromises).then(() => {

  });
}
