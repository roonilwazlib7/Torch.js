class Game
    constructor: (canvasId, width, height, name, graphicsType, pixel) ->

        return new Torch.CanvasGame(canvasId, width, height, name, graphicsType, pixel) if graphicsType is Torch.CANVAS
        return new Torch.WebGLGame(canvasId, width, height, name, graphicsType, pixel)  if graphicsType is Torch.WEBGL

Game = CanvasGame

TorchModule Game, "Game"
