// Generated by CoffeeScript 1.11.1
(function() {
  var SpriteGroup,
    slice = [].slice;

  SpriteGroup = (function() {
    function SpriteGroup(sprites1, game) {
      var i, len, ref, sprite;
      this.sprites = sprites1 != null ? sprites1 : [];
      this.game = game;
      ref = this.sprites;
      for (i = 0, len = ref.length; i < len; i++) {
        sprite = ref[i];
        sprite.anchorX = sprite.Rectangle.x;
      }
      return this;
    }

    SpriteGroup.prototype.Factory = function(spriteClass) {
      this.spriteFactory = spriteClass;
      return this;
    };

    SpriteGroup.prototype.Add = function() {
      var args, newSprite, sprites, x, y;
      sprites = arguments[0], x = arguments[1], y = arguments[2], args = 4 <= arguments.length ? slice.call(arguments, 3) : [];
      if (sprites === null || sprites === void 0 && this.spriteFactory !== void 0) {
        newSprite = (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(this.spriteFactory, [this.game, x, y].concat(slice.call(args)), function(){});
        this.sprites.push(newSprite);
        return newSprite;
      } else {
        this.sprites = this.sprites.concat(sprites);
      }
      return this;
    };

    SpriteGroup.prototype.Trash = function() {
      var i, len, ref, sprite;
      ref = this.sprites;
      for (i = 0, len = ref.length; i < len; i++) {
        sprite = ref[i];
        sprite.Trash();
      }
      return this;
    };

    SpriteGroup.prototype.Shift = function(transition) {
      var i, len, ref, results, sprite;
      ref = this.sprites;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        sprite = ref[i];
        if (transition.x) {
          results.push(sprite.Rectangle.x = sprite.anchorX + transition.x);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    SpriteGroup.prototype.Hide = function() {
      var i, len, ref, sprite;
      ref = this.sprites;
      for (i = 0, len = ref.length; i < len; i++) {
        sprite = ref[i];
        sprite.draw = false;
      }
      return this;
    };

    SpriteGroup.prototype.Show = function() {
      var i, len, ref, sprite;
      ref = this.sprites;
      for (i = 0, len = ref.length; i < len; i++) {
        sprite = ref[i];
        sprite.draw = true;
      }
      return this;
    };

    SpriteGroup.prototype.Center = function() {
      var i, len, ref, sprite;
      ref = this.sprites;
      for (i = 0, len = ref.length; i < len; i++) {
        sprite = ref[i];
        sprite.Center();
      }
      return this;
    };

    SpriteGroup.prototype.ToggleFixed = function() {
      var i, len, ref, sprite;
      ref = this.sprites;
      for (i = 0, len = ref.length; i < len; i++) {
        sprite = ref[i];
        sprite.ToggleFixed();
      }
      return this;
    };

    return SpriteGroup;

  })();

  Torch.SpriteGroup = SpriteGroup;

}).call(this);
