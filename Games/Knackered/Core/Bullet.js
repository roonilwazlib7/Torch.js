// Generated by CoffeeScript 1.10.0
(function() {
  var Bullet, exports,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  exports = this;

  Bullet = (function(superClass) {
    extend(Bullet, superClass);

    function Bullet(game, x, y) {
      this.InitSprite(game, x, y);
      this.Bind.Texture("bullet");
      this.VELOCITY = 1;
      this.target = "";
      this.On("OutOfBounds", (function(_this) {
        return function() {
          return _this.Trash();
        };
      })(this));
      this.DrawIndex(-1);
    }

    Bullet.prototype.Target = function(target) {
      this.target = target;
      if (this.target === "player") {
        this.Velocity("y", this.VELOCITY);
      } else if (this.target === "enemy") {
        this.Velocity("y", -this.VELOCITY);
      }
      return this;
    };

    Bullet.prototype.Explode = function() {
      this.Velocity("x", 0).Velocity("y", 0);
      this.Bind.Texture("bullet-explode");
      return this.game.Timer.SetFutureEvent(100, (function(_this) {
        return function() {
          return _this.Trash();
        };
      })(this));
    };

    Bullet.prototype.Update = function() {
      var en, enemies, i, len, results;
      Bullet.__super__.Update.call(this);
      if (this.target === "player") {
        if (this.CollidesWith(player).AABB()) {
          return this.Explode();
        }
      } else if (this.target === "enemy") {
        enemies = enemyManager.Enemies();
        results = [];
        for (i = 0, len = enemies.length; i < len; i++) {
          en = enemies[i];
          if (this.CollidesWith(en).AABB()) {
            results.push(this.Explode());
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    return Bullet;

  })(Torch.Sprite);

  exports.Bullet = Bullet;

}).call(this);
