// Generated by CoffeeScript 1.11.1
(function() {
  var ThreeSprite,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ThreeSprite = (function(superClass) {
    extend(ThreeSprite, superClass);

    function ThreeSprite(sprite, material, shape) {
      var object, transform;
      this.sprite = sprite;
      object = new THREE.Mesh(shape, material);
      transform = this.sprite.GetThreeTransform("x");
      object.position.z = this.sprite.Rectangle.z;
      object.position.x = transform.x;
      object.position.y = transform.y;
      object.name = this.sprite._torch_uid;
      this.sprite.game.gl_scene.add(object);
      this.Entity(object);
    }

    ThreeSprite.prototype.Position = function(plane, optionalArgument) {
      if (optionalArgument === null || optionalArgument === void 0) {
        return this.entity.position[plane];
      } else {
        if (typeof optionalArgument !== "number") {
          this.game.FatalError("Cannot set position. Expected number, got: " + (typeof optionalArgument));
        }
        this.entity.position[plane] = optionalArgument;
        return this;
      }
    };

    ThreeSprite.prototype.Rotation = function(arg) {
      this.entity.rotation.z = arg;
      return this;
    };

    ThreeSprite.prototype.Opacity = function(arg) {
      this.entity.material.opacity = arg;
      return this;
    };

    ThreeSprite.prototype.DrawIndex = function(arg) {
      this.entity.renderOrder = arg;
      return this;
    };

    ThreeSprite.prototype.Remove = function() {
      return this.sprite.game.gl_scene.remove(this.entity);
    };

    return ThreeSprite;

  })(ThreeEntity);

  Torch.ThreeSprite = ThreeSprite;

}).call(this);
