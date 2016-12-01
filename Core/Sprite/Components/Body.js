// Generated by CoffeeScript 1.10.0
(function() {
  var Body;

  Body = (function() {
    function Body() {
      var Plane;
      Plane = function() {
        this.velocity = 0;
        this.acceleration = 0;
        this.lv = 0;
        this.la = 0;
        this.aTime = 0;
        return this.maxVelocity = 100;
      };
      this.x = new Plane();
      this.y = new Plane();
    }

    Body.prototype.Velocity = function(plane, velocity) {
      this[plane].velocity = velocity;
      return this;
    };

    Body.prototype.Acceleration = function(plane, acceleration) {
      this[plane].acceleration = acceleration;
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