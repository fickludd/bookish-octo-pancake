function startMouseDrawCommand(self, coords, activeLayer) {
  const step = {
    applyStep: (context) => {

      // Draw initial point
      context.fillStyle = activeLayer.color;
      context.beginPath();
      context.arc(coords.x, coords.y, self.size / 2, 0, 2 * Math.PI);
      context.fill();
    }
  };

  self.steps.push(step);

  return step;
}

function updateMouseDrawCommand(self, coords, previous, activeLayer) {
  const step = {
    applyStep: (context) => {
      // Override the tool's color with the layer's color
      const originalColor = self.color;
      self.color = activeLayer.color;
      self.draw(self, context, previous, coords);
      self.color = originalColor;
    }
  };

  self.steps.push(step);

  return step;
}

function endMouseDrawCommand(self, activeLayer) {
  if (self.steps.length == 0) {
    return null;
  }
  
  const command = {
    label: self.name + " draw",
    layer: activeLayer,
    steps: self.steps,
    applyCommand: (self, context) => {
      self.steps.forEach(step => step.applyStep(context));
    }
  }
  self.steps = [];
  return command;
}

export const tools = {
  brush: {
    name: 'brush',
    icon: '🖌️',
    color: 'black',
    size: 10,
    steps: [],
    startCommand: startMouseDrawCommand,
    updateCommand: updateMouseDrawCommand,
    endCommand: endMouseDrawCommand,
    draw: (self, context, from, to) => {
      context.strokeStyle = self.color;
      context.lineWidth = self.size;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
  },
  eraser: {
    name: 'eraser',
    icon: '🧹',
    color: '#908383', // Same as canvas background
    size: 20,
    steps: [],
    startCommand: startMouseDrawCommand,
    updateCommand: updateMouseDrawCommand,
    endCommand: endMouseDrawCommand,
    draw: (self, context, from, to) => {
      context.strokeStyle = self.color; //'#908383';
      context.lineWidth = self.size; //20;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
  }
}; 