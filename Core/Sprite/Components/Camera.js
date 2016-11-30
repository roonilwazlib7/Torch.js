// Generated by CoffeeScript 1.10.0
(function() {
  var Camera;

  Camera = (function() {
    function Camera(game) {
      this.game = game;
      this.position = new Torch.Point(0, 0);
    }

    Camera.prototype.Update = function() {
      return this.Bind();
    };

    Camera.prototype.Bind = function() {
      if (this.game.GL) {
        return this.game.gl_camera.position.set(this.position.x, this.position.y, this.position.z);
      }
    };

    return Camera;

  })();

  Torch.Camera = Camera;

}).call(this);
