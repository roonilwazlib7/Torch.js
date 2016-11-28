// Generated by CoffeeScript 1.10.0
(function() {
  var Player,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Player = (function(superClass) {
    extend(Player, superClass);

    Player.prototype.VELOCITY = 0.4;

    Player.prototype.stoppped = false;

    Player.prototype.touching = null;

    function Player(game) {
      this.touching = {};
      this.InitSprite(game, 0, 0);
      this.Bind.Texture("player");
      this.Center().CenterVertical();
      this.Position("y", window.innerHeight - 100);
      this.On("Collision", (function(_this) {
        return function(event) {
          _this.touching = _this.Collisions.SimpleCollisionHandle(event, 1.5);
          return _this.Velocity("x", 0).Velocity("y", 0);
        };
      })(this));
    }

    Player.prototype.Update = function() {
      Player.__super__.Update.call(this);
      return this.Move();
    };

    Player.prototype.Move = function() {
      var keys;
      keys = this.game.Keys;
      this.Velocity("x", 0).Velocity("y", 0);
      if (keys.D.down && this.touching && !this.touching.right) {
        this.Velocity("x", this.VELOCITY);
      } else {
        this.touching.right = false;
      }
      if (keys.A.down && this.touching && !this.touching.left) {
        this.Velocity("x", -this.VELOCITY);
      } else {
        this.touching.left = false;
      }
      if (keys.S.down && this.touching && !this.touching.bottom) {
        this.Velocity("y", this.VELOCITY);
      } else {
        this.touching.bottom = false;
      }
      if (keys.W.down && this.touching && !this.touching.top) {
        return this.Velocity("y", -this.VELOCITY);
      } else {
        return this.touching.top = false;
      }
    };

    return Player;

  })(Torch.Sprite);

  window.Player = Player;

}).call(this);
