import type { Command } from './CommandHistory';

export class DrawCommand implements Command {
  constructor(
    private startCoords: { x: number; y: number },
    private endCoords: { x: number; y: number },
    private color: string,
    private size: number
  ) {}

  execute(context: CanvasRenderingContext2D): void {
    context.strokeStyle = this.color;
    context.lineWidth = this.size;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(this.startCoords.x, this.startCoords.y);
    context.lineTo(this.endCoords.x, this.endCoords.y);
    context.stroke();
  }
} 