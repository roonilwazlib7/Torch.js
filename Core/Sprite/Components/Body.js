// Generated by CoffeeScript 1.10.0
(function() {
  var Body;

  Body = (function() {
    function Body(sprite) {
      this.sprite = sprite;
      this.game = this.sprite.game;
      this.velocity = new Torch.Vector(0, 0);
      this.acceleration = new Torch.Vector(0, 0);
    }

    Body.prototype.Update = function() {
      this.sprite.position.x += this.velocity.x * this.game.Loop.updateDelta;
      this.sprite.position.y += this.velocity.y * this.game.Loop.updateDelta;
      this.velocity.x += this.acceleration.x * this.game.Loop.updateDelta;
      return this.velocity.y += this.acceleration.y * this.game.Loop.updateDelta;
    };

    Body.prototype.Velocity = function(plane, velocity) {
      this.velocity[plane] = velocity;
      return this;
    };

    Body.prototype.Acceleration = function(plane, acceleration) {
      this.acceleration[plane] = acceleration;
      return this;
    };

    Body.prototype.Debug = function(turnOn) {
      if (turnOn == null) {
        turnOn = true;
      }
      return this.DEBUG = turnOn;
    };

    return Body;

  })();

  Torch.Body = Body;

}).call(this);
