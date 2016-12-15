// Generated by CoffeeScript 1.10.0
(function() {
  var Point, Rectangle, Vector;

  Rectangle = (function() {
    function Rectangle(x1, y1, width, height) {
      this.x = x1;
      this.y = y1;
      this.width = width;
      this.height = height;
      this.z = 0;
    }

    Rectangle.prototype.GetOffset = function(rectangle) {
      var halfHeights, halfWidths, offset, sharedXPlane, sharedYPlane, vx, vy;
      vx = (this.x + (this.width / 2)) - (rectangle.x + (rectangle.width / 2));
      vy = (this.y + (this.height / 2)) - (rectangle.y + (rectangle.height / 2));
      halfWidths = (this.width / 2) + (rectangle.width / 2);
      halfHeights = (this.height / 2) + (rectangle.height / 2);
      sharedXPlane = (this.x + this.width) - (rectangle.x + rectangle.width);
      sharedYPlane = (this.y + this.height) - (rectangle.y + rectangle.height);
      offset = {
        x: halfWidths - Math.abs(vx),
        y: halfHeights - Math.abs(vy),
        vx: vx,
        vy: vy,
        halfWidths: halfWidths,
        halfHeights: halfHeights,
        sharedXPlane: sharedXPlane,
        sharedYPlane: sharedYPlane
      };
      return offset;
    };

    Rectangle.prototype.Intersects = function(rectangle) {
      var a, b;
      a = this;
      b = rectangle;
      if (a.x < (b.x + b.width) && (a.x + a.width) > b.x && a.y < (b.y + b.height) && (a.y + a.height) > b.y) {
        return a.GetOffset(b);
      } else {
        return false;
      }
    };

    Rectangle.prototype.ShiftFrom = function(rectangle, transX, transY) {
      var x, y;
      x = null;
      y = null;
      if (transX === void 0) {
        x = rectangle.x;
      } else {
        x = rectangle.x + transX;
      }
      if (transY === void 0) {
        y = rectangle.y;
      } else {
        y = rectangle.y + transY;
      }
      this.x = x;
      return this.y = y;
    };

    return Rectangle;

  })();

  Vector = (function() {
    Vector.prototype.x = null;

    Vector.prototype.y = null;

    Vector.prototype.angle = null;

    Vector.prototype.magnitude = null;

    function Vector(x1, y1) {
      this.x = x1;
      this.y = y1;
      this.ResolveVectorProperties();
    }

    Vector.prototype.ResolveVectorProperties = function() {
      this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
      return this.angle = Math.atan2(this.x, this.y);
    };

    Vector.prototype.Clone = function() {
      return new Torch.Vector(this.x, this.y);
    };

    Vector.prototype.Set = function(x, y) {
      this.x = x;
      this.y = y;
      return this.ResolveVectorProperties();
    };

    Vector.prototype.AddScalar = function(n) {
      this.x += n;
      this.y += n;
      return this.ResolveVectorProperties();
    };

    Vector.prototype.MultiplyScalar = function(n) {
      this.x *= n;
      this.y *= n;
      return this.ResolveVectorProperties();
    };

    Vector.prototype.DivideScalar = function(n) {
      this.x /= n;
      this.y /= n;
      return this.ResolveVectorProperties();
    };

    Vector.prototype.SubtractVector = function(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this.ResolveVectorProperties();
    };

    Vector.prototype.AddVector = function(v) {
      this.x += v.x;
      this.y += v.y;
      return this.ResolveVectorProperties();
    };

    Vector.prototype.Normalize = function() {
      return this.DivideScalar(this.magnitude);
    };

    Vector.prototype.DotProduct = function(v) {
      return this.x * v.x + this.y * v.y;
    };

    Vector.prototype.IsPerpendicular = function(v) {
      return this.DotProduct(v) === 0;
    };

    Vector.prototype.IsSameDirection = function(v) {
      return this.DotProduct(v) > 0;
    };

    return Vector;

  })();

  Point = (function() {
    function Point(x1, y1, z) {
      this.x = x1;
      this.y = y1;
      this.z = z != null ? z : 0;
    }

    Point.prototype.Apply = function(point) {
      this.x += point.x;
      return this.y += point.y;
    };

    Point.prototype.Clone = function() {
      return new Point(this.x, this.y);
    };

    return Point;

  })();

}).call(this);
