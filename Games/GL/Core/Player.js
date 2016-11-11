// Generated by CoffeeScript 1.10.0
(function() {
  var Player, exports,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  exports = this;

  Player = (function(superClass) {
    extend(Player, superClass);

    Player.prototype.VELOCITY = 1;

    function Player(game) {
      this.InitSprite(game, 0, 0);
      this.Bind.WebGLTexture("player");
      this.internalLight = new Torch.PointLight(0xffffff, 2, 500);
      this.Attatch(this.internalLight);
    }

    Player.prototype.Update = function() {
      var keys;
      Player.__super__.Update.call(this);
      keys = this.game.Keys;
      this.Velocity("x", 0);
      this.Velocity("y", 0);
      if (keys.D.down) {
        this.Velocity("x", this.VELOCITY);
      }
      if (keys.A.down) {
        this.Velocity("x", -this.VELOCITY);
      }
      if (keys.S.down) {
        this.Velocity("y", this.VELOCITY);
      }
      if (keys.W.down) {
        this.Velocity("y", -this.VELOCITY);
      }
      this.Position("x", this.game.Mouse.x);
      this.Position("y", this.game.Mouse.y);
      this.internalLight.Position("x", this.Position("x"));
      return this.internalLight.Position("y", -this.Position("y"));
    };

    return Player;

  })(Torch.Sprite);

  exports.Player = Player;

}).call(this);
