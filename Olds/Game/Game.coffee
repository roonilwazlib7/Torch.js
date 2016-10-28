class Game
    constructor: (canvasId, width, height, name, graphicsType = Torch.CANVAS) ->

        return new Torch.CanvasGame(canvasId, width, height, name, graphicsType) if graphicsType is Torch.CANVAS
        return new Torch.WebGLGame(canvasId, width, height, name, graphicsType)  if graphicsType is Torch.WEBGL

Torch.Game = Game
