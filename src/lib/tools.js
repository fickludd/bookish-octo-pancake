function startMouseDrawCommand(self, coords, activeLayer) {
  const step = {
    applyStep: (context) => {
      // Draw initial point
      context.fillStyle = self.color;
      context.globalAlpha = self.opacity;
      context.beginPath();
      context.arc(coords.x, coords.y, self.size / 2, 0, 2 * Math.PI);
      context.fill();
      context.globalAlpha = 1.0;
    }
  };

  self.steps.push(step);

  return step;
}

function updateMouseDrawCommand(self, coords, previous, activeLayer) {
  const step = {
    applyStep: (context) => {
      self.draw(self, context, previous, coords);
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
    opacity: 1.0,
    steps: [],
    startCommand: startMouseDrawCommand,
    updateCommand: updateMouseDrawCommand,
    endCommand: endMouseDrawCommand,
    draw: (self, context, from, to) => {
      // Calculate distance between points
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate number of steps based on distance
      const steps = Math.max(1, Math.ceil(distance / (self.size / 2)));
      
      // Draw interpolated points
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = from.x + dx * t;
        const y = from.y + dy * t;
        
        context.fillStyle = self.color;
        context.globalAlpha = self.opacity;
        context.beginPath();
        context.arc(x, y, self.size / 2, 0, 2 * Math.PI);
        context.fill();
      }
      context.globalAlpha = 1.0;
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
      // Save the current composite operation
      const originalComposite = context.globalCompositeOperation;
      // Set to destination-out to erase
      context.globalCompositeOperation = 'destination-out';
      
      context.strokeStyle = 'black'; // Color doesn't matter for erasing
      context.lineWidth = self.size;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
      
      // Restore the original composite operation
      context.globalCompositeOperation = originalComposite;
    }
  }
}; 