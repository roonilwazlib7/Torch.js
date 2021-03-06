// Generated by CoffeeScript 1.11.1
(function() {
  var Bullet, exports,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  exports = this;

  Bullet = (function(superClass) {
    extend(Bullet, superClass);

    function Bullet(game, x, y, shooter) {
      this.shooter = shooter;
      this.InitSprite(game, x, y);
      this.Bind.WebGLTexture("bullet");
      this.Velocity("y", -1);
      this.Move("x", -this.Width() / 2);
      this.On("Collision", (function(_this) {
        return function(event) {};
      })(this));
      this.On("OutOfBounds", (function(_this) {
        return function(event) {};
      })(this));
    }

    Bullet.prototype.Update = function() {
      return Bullet.__super__.Update.call(this);
    };

    return Bullet;

  })(Torch.Sprite);

  exports.Bullet = Bullet;

}).call(this);
