// Generated by CoffeeScript 1.10.0
(function() {
  var GhostSprite, Sprite,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Sprite = (function() {
    function Sprite(game, x, y) {
      this.InitSprite(game, x, y);
    }

    Sprite.MixIn(Torch.EventDispatcher).MixIn(Torch.Trashable);

    Sprite.prototype.InitSprite = function(game, x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (game === null || game === void 0) {
        Torch.FatalError("Unable to initialize sprite without game");
      }
      this.InitEventDispatch();
      this.game = game;
      this.GL = this.game.graphicsType === Torch.WEBGL;
      this.rectangle = new Torch.Rectangle(x, y, 0, 0);
      this.position = new Torch.Point(x, y);
      this.Bind = new Torch.Bind(this);
      this.Collisions = new Torch.CollisionManager(this);
      this.Body = new Torch.Body(this);
      this.Size = new Torch.Size(this);
      this.Events = new Torch.EventManager(this);
      this.Effects = new Torch.EffectManager(this);
      this.DrawTexture = null;
      this.TexturePack = null;
      this.TextureSheet = null;
      this.fixed = false;
      this.draw = true;
      this.drawIndex = 0;
      this.rotation = 0;
      this.opacity = 1;
      this._torch_add = "Sprite";
      this._torch_uid = "";
      this.events = {};
      this.tasks = {};
      this.children = [];
      this.stateMachines = [];
      if (!this.GL) {
        this.renderer = new CanvasRenderer(this);
      }
      return game.Add(this);
    };

    Sprite.prototype.Fixed = function(tog) {
      if (tog !== void 0) {
        if (this.fixed) {
          this.fixed = false;
        } else {
          this.fixed = true;
        }
      } else {
        this.fixed = tog;
      }
      return this;
    };

    Sprite.prototype.UpdateSprite = function() {
      this.Body.Update();
      this.Size.Update();
      this.Events.Update();
      this.rectangle.x = this.position.x;
      this.rectangle.y = this.position.y;
      return this.Collisions.Update();
    };

    Sprite.prototype.UpdateEvents = function() {
      var mouseRec, reComputedMouseRec;
      if (!this.game.Mouse.GetRectangle(this.game).Intersects(this.rectangle) && this.mouseOver) {
        this.mouseOver = false;
        this.Emit("MouseLeave", new Torch.Event(this.game, {
          sprite: this
        }));
      }
      if (this.game.Mouse.GetRectangle(this.game).Intersects(this.rectangle)) {
        if (!this.mouseOver) {
          this.Emit("MouseOver", new Torch.Event(this.game, {
            sprite: this
          }));
        }
        this.mouseOver = true;
      } else if (this.fixed) {
        mouseRec = this.game.Mouse.GetRectangle();
        reComputedMouseRec = new Torch.Rectangle(mouseRec.x, mouseRec.y, mouseRec.width, mouseRec.height);
        reComputedMouseRec.x += this.game.Viewport.x;
        reComputedMouseRec.y += this.game.Viewport.y;
        if (reComputedMouseRec.Intersects(this.rectangle)) {
          this.mouseOver = true;
        } else {
          this.mouseOver = false;
        }
      } else {
        this.mouseOver = false;
      }
      if (this.mouseOver && this.game.Mouse.down && !this.clickTrigger) {
        this.clickTrigger = true;
      }
      if (this.clickTrigger && !this.game.Mouse.down && this.mouseOver) {
        this.wasClicked = true;
        this.Emit("Click", new Torch.Event(this.game, {
          sprite: this
        }));
        this.clickTrigger = false;
      }
      if (this.clickTrigger && !this.game.Mouse.down && !this.mouseOver) {
        this.clickTrigger = false;
      }
      if (!this.game.Mouse.down && !this.mouseOver && this.clickAwayTrigger) {
        this.Emit("ClickAway", new Torch.Event(this.game, {
          sprite: this
        }));
        this.wasClicked = false;
        this.clickAwayTrigger = false;
      } else if (this.clickTrigger && !this.game.Mouse.down && this.mouseOver) {
        this.clickAwayTrigger = false;
      } else if (this.game.Mouse.down && !this.mouseOver) {
        this.clickAwayTrigger = true;
      }
      if (!this.rectangle.Intersects(this.game.BoundRec)) {
        return this.Emit("OutOfBounds", new Torch.Event(this.game, {
          sprite: this
        }));
      }
    };

    Sprite.prototype.UpdateGLEntities = function() {
      var transform;
      if (!this.GL) {
        return;
      }
      transform = this.GetThreeTransform();
      if (this.GL && this.gl_three_sprite) {
        return this.Three().Position("x", transform.x).Position("y", transform.y).Position("z", this.rectangle.z).Rotation(this.rotation).DrawIndex(this.drawIndex).Opacity(this.opacity).Width(this.Width()).Height(this.Height());
      }
    };

    Sprite.prototype.Update = function() {
      return this.UpdateSprite();
    };

    Sprite.prototype.GetCurrentDraw = function() {
      if (this.TexturePack) {
        return this.TexturePackAnimation.GetCurrentFrame();
      } else if (this.TextureSheet) {
        return this.TextureSheetAnimation.GetCurrentFrame();
      } else if (this.DrawTexture) {
        return this.DrawTexture;
      }
    };

    Sprite.prototype.Draw = function() {
      if (this.renderer !== null) {
        return this.renderer.Draw();
      }
    };

    Sprite.prototype.Hide = function() {
      this.draw = false;
      return this;
    };

    Sprite.prototype.Show = function() {
      this.draw = true;
      return this;
    };

    Sprite.prototype.Clone = function(x, y) {
      var proto;
      proto = this.constructor;
      return new proto(this.game, x, y);
    };

    Sprite.prototype.NotSelf = function(otherSprite) {
      return otherSprite._torch_uid !== this._torch_uid;
    };

    Sprite.prototype.Three = function() {
      if (!this.GL) {
        throw "Unable to access three.js object";
      }
      return this.gl_three_sprite;
    };

    Sprite.prototype.Rotation = function(rotation) {
      if (rotation === void 0) {
        return this.rotation;
      } else {
        if (typeof rotation !== "number") {
          this.game.FatalError("Rotation values must be a number. Provided was '" + (typeof rotation) + "'");
        }
        this.rotation = rotation;
        return this;
      }
    };

    Sprite.prototype.Opacity = function(opacity) {
      if (opacity === void 0) {
        return this.opacity;
      } else {
        if (typeof opacity !== "number") {
          this.game.FatalError("Opacity values must be a number. Provided was '" + (typeof opacity) + "'");
        }
        this.opacity = opacity;
        return this;
      }
    };

    Sprite.prototype.DrawIndex = function(drawIndex) {
      if (drawIndex === void 0) {
        return this.drawIndex;
      } else {
        if (typeof drawIndex !== "number") {
          this.game.FatalError("DrawIndex values must be a number. Provided was '" + (typeof drawIndex) + "'");
        }
        this.drawIndex = drawIndex;
        return this;
      }
    };

    Sprite.prototype.Scale = function(scale) {
      if (scale === void 0) {
        return this.scale;
      } else {
        return this.scale = scale;
      }
    };

    Sprite.prototype.GetDirectionVector = function(otherSprite) {
      var vec;
      vec = new Torch.Vector(otherSprite.Rectangle.x - this.position.x, otherSprite.Rectangle.y - this.position.y);
      vec.Normalize();
      return vec;
    };

    Sprite.prototype.GetDistance = function(otherSprite) {
      var otherVec, thisVec;
      thisVec = new Torch.Vector(this.position.x, this.position.y);
      otherVec = new Torch.Vector(otherSprite.rectangle.x, otherSprite.rectangle.y);
      return thisVec.GetDistance(otherVec);
    };

    Sprite.prototype.GetAngle = function(otherSprite) {
      var angle, directionVector;
      directionVector = this.GetDirectionVector(otherSprite);
      angle = Math.atan2(directionVector.y, directionVector.x);
      return angle + (Math.PI + (Math.PI / 2));
    };

    Sprite.prototype.Center = function() {
      var width, x;
      width = this.game.canvasNode.width;
      x = (width / 2) - (this.rectangle.width / 2);
      this.position.x = x;
      return this;
    };

    Sprite.prototype.CenterVertical = function() {
      var height, y;
      height = this.game.canvasNode.height;
      y = (height / 2) - (this.rectangle.height / 2);
      this.position.y = y;
      return this;
    };

    Sprite.prototype.CollidesWith = function(otherSprite) {
      return new Torch.Collider.CollisionDetector(this, otherSprite);
    };

    Sprite.prototype.Attatch = function(otherItem) {
      this.children.push(otherItem);
      return this.game.Add(otherItem);
    };

    Sprite.prototype.GetThreeTransform = function() {
      var point;
      point = this.game.GetThreeTransform(this.Position("x") + this.Width() / 2, this.Position("y") + this.Height() / 2);
      point.x -= this.Width() / 4;
      return point;
    };

    return Sprite;

  })();


  /*
      @class Torch.GhostSprite @extends Torch.Sprite
      @author roonilwazlib
  
      @abstract
  
      @description
          DEPRECATED. Use Torch.Task instead
          Used to create an 'invisible' sprite, i.e a sprite that is
          updated and not drawn.
   */

  GhostSprite = (function(superClass) {
    extend(GhostSprite, superClass);

    function GhostSprite() {
      return GhostSprite.__super__.constructor.apply(this, arguments);
    }

    GhostSprite.prototype.GHOST_SPRITE = true;

    return GhostSprite;

  })(Sprite);

  Torch.Sprite = Sprite;

  Torch.GhostSprite = GhostSprite;

}).call(this);
