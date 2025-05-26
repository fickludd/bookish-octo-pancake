class CommandHistoryManager {
  constructor(layers, commandHistory) {
    this.commands = commandHistory;
    this.currentIndex = -1;
    this.layers = layers;
  }

  addCommand(command) {
    // Remove any undone commands
    //this.commands.push(command);
  }

  replayCommands() {
    // For each layer
    this.layers.forEach(layer => {
      const context = layer.canvas.getContext('2d');
      if (!context) return;

      // Clear current state
      context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
      
      // Copy base state
      const baseCanvas = this.baseState.get(layer.id);
      if (baseCanvas) {
        context.drawImage(baseCanvas, 0, 0);
      }

      // Replay commands up to current index
      for (let i = 0; i <= this.currentIndex; i++) {
        this.commands[i].execute(context);
      }
    });
  }

  // Helper method to check if undo/redo is available
  canUndo() {
    return this.currentIndex >= 0;
  }

  canRedo() {
    return this.currentIndex < this.commands.length - 1;
  }
}

// Export the class
export { CommandHistoryManager }; 