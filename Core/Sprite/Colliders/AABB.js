// Generated by CoffeeScript 1.10.0
(function() {
  var AABB;

  AABB = (function() {
    function AABB(sprite, otherSprite) {
      this.sprite = sprite;
      this.otherSprite = otherSprite;
    }

    AABB.prototype.Execute = function() {
      return this.sprite.Rectangle.Intersects(this.otherSprite.Rectangle);
    };

    return AABB;

  })();

  Torch.Collider.AABB = AABB;

}).call(this);
