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
  for (let i = 0; i <= endIndex; i++) {
    const command = commands[i];
    const {base, latest} = getOrCreateLayerCanvas(command.layer.id);
    const baseContext = base.getContext('2d');
    const latestContext = latest.getContext('2d');
    
    // Apply to both base and latest
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