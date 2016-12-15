// Generated by CoffeeScript 1.10.0

/*
    @class Torch.Game
    @author roonilwazlib

    @constructor
        @param canvasId, string, REQUIRED
        @param width, number|string, REQUIRED
        @param height, number|string, REQUIRED
        @param name, string, REQUIRED
        @param graphicsType, enum, REQUIRED
        @param pixel, enum

    @description
        A weird little class, Torch.Game acts as a facade and switches either a
        Torch.WebGLGame or Torch.CanvasGame in for itself depending on the desired
        graphics type
 */

(function() {
  var Game;

  Game = (function() {
    function Game(canvasId, width, height, name, graphicsType, pixel) {
      if (graphicsType === Torch.CANVAS) {
        return new Torch.CanvasGame(canvasId, width, height, name, graphicsType, pixel);
      }
      if (graphicsType === Torch.WEBGL) {
        return new Torch.WebGLGame(canvasId, width, height, name, graphicsType, pixel);
      }
    }

    return Game;

  })();

}).call(this);
