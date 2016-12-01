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
      this.Body.Debug();
      this.Bind.Texture("player");
      this.Center();
      this.position.y = window.innerHeight - 100;
      this.Collisions.Monitor();
      this.On("Collision", (function(_this) {
        return function(event) {
          _this.touching = _this.Collisions.SimpleCollisionHandle(event, 0.5);
          _this.Body.Velocity("x", 0);
          return _this.Body.Velocity("y", 0);
        };
      })(this));
    }

    Player.prototype.Update = function() {
      Player.__super__.Update.call(this);
      return this.Movement();
    };

    Player.prototype.Movement = function() {
      var keys;
      keys = this.game.Keys;
      this.Body.Velocity("x", 0);
      this.Body.Velocity("y", 0);
      if (!keys.A.down && !keys.S.down && !keys.W.down) {
        if (keys.D.down && this.touching && !this.touching.right) {
          return this.Body.Velocity("x", this.VELOCITY);
        } else {
          return this.touching.right = false;
        }
      } else if (!keys.D.down && !keys.S.down && !keys.W.down) {
        if (keys.A.down && this.touching && !this.touching.left) {
          return this.Body.Velocity("x", -this.VELOCITY);
        } else {
          return this.touching.left = false;
        }
      } else if (!keys.A.down && !keys.D.down && !keys.W.down) {
        if (keys.S.down && this.touching && !this.touching.bottom) {
          return this.Body.Velocity("y", this.VELOCITY);
        } else {
          return this.touching.bottom = false;
        }
      } else if (!keys.A.down && !keys.S.down && !keys.D.down) {
        if (keys.W.down && this.touching && !this.touching.top) {
          return this.Body.Velocity("y", -this.VELOCITY);
        } else {
          return this.touching.top = false;
        }
      }
    };

    return Player;

  })(Torch.Sprite);

  window.Player = Player;

}).call(this);
