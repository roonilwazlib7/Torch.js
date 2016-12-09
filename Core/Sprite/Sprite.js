// Generated by CoffeeScript 1.10.0
(function() {
  var GhostSprite, Sprite,
    slice = [].slice,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Sprite = (function() {
    Sprite.MixIn(Torch.EventDispatcher).MixIn(Torch.Trashable);

    Sprite.prototype.__torch__ = Torch.Types.Sprite;

    function Sprite(game, x, y) {
      this.InitSprite(game, x, y);
    }

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
      this.States = new Torch.StateMachineManager(this);
      this.Grid = new Torch.GridManager(this);
      this.DrawTexture = null;
      this.TexturePack = null;
      this.TextureSheet = null;
      this.TextureSimple = null;
      this.fixed = false;
      this.draw = true;
      this.drawIndex = 0;
      this.rotation = 0;
      this.opacity = 1;
      this._torch_add = "Sprite";
      this._torch_uid = "";
      this.events = {};
      this.renderer = new CanvasRenderer(this);
      return game.Add(this);
    };

    Sprite.prototype.UpdateSprite = function() {
      this.Body.Update();
      this.Size.Update();
      this.Events.Update();
      this.States.Update();
      this.Grid.Update();
      this.rectangle.x = this.position.x;
      this.rectangle.y = this.position.y;
      return this.Collisions.Update();
    };

    Sprite.prototype.Update = function() {
      return this.UpdateSprite();
    };

    Sprite.prototype.Draw = function() {
      if (this.renderer !== null) {
        return this.renderer.Draw();
      }
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

    Sprite.prototype.Clone = function() {
      var args, proto;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      proto = this.constructor;
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(proto, args, function(){});
    };

    Sprite.prototype.NotSelf = function(otherSprite) {
      return otherSprite._torch_uid !== this._torch_uid;
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

    return Sprite;

  })();


  /*
  gonna kill this...
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
