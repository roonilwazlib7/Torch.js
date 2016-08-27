// Generated by CoffeeScript 1.10.0
(function() {
  var Viewport;

  Viewport = (function() {
    function Viewport(game) {
      this.game = game;
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
      this.rotation = 0;
    }

    Viewport.prototype.Update = function() {};

    Viewport.prototype.GetViewRectangle = function() {
      return new Torch.Rectangle(-this.x, -this.y, this.width, this.height);
    };

    return Viewport;

  })();

  Torch.Viewport = Viewport;

}).call(this);
