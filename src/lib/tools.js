export const tools = {
  brush: {
    name: 'brush',
    icon: '🖌️',
    color: 'black',
    size: 10,
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