// Generated by CoffeeScript 1.10.0
(function() {
  var Circle;

  Circle = (function() {
    function Circle(sprite, otherSprite) {
      this.sprite = sprite;
      this.otherSprite = otherSprite;
    }

    Circle.prototype.Execute = function() {
      var circle1, circle2, distance, dx, dy;
      circle1 = {
        radius: this.sprite.Width(),
        x: this.sprite.Position("x"),
        y: this.sprite.Position("y")
      };
      circle2 = {
        radius: this.otherSprite.Width(),
        x: this.otherSprite.Position("x"),
        y: this.otherSprite.Position("y")
      };
      dx = circle1.x - circle2.x;
      dy = circle1.y - circle2.y;
      distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < circle1.radius + circle2.radius) {
        return true;
      }
      return false;
    };

    return Circle;

  })();

  Torch.Collider.Circle = Circle;

}).call(this);
