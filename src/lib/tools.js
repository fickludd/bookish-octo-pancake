export const tools = {
  brush: {
    name: 'brush',
    icon: '🖌️',
    color: 'black',
    size: 10,
    draw: (context, from, to) => {
      context.strokeStyle = 'black';
      context.lineWidth = 10;
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
    draw: (context, from, to) => {
      context.strokeStyle = '#908383';
      context.lineWidth = 20;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
  }
}; 