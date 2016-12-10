// Generated by CoffeeScript 1.10.0
(function() {
  var Branch, Bumps, Bush, LightGrass, MapPiece, PlayerStart, Water, exports,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  exports = this;

  MapPiece = (function(superClass) {
    extend(MapPiece, superClass);

    MapPiece.prototype.MAPPIECE = true;

    MapPiece.prototype.identifier = 0;

    MapPiece.prototype.textureId = "";

    MapPiece.prototype.data = null;

    MapPiece.prototype.scaleWidth = 1;

    MapPiece.prototype.scaleHeight = 1;

    MapPiece.prototype.hardBlock = true;

    MapPiece.prototype.hp = 2;

    function MapPiece(game, rawData) {
      this.data = this.GetData(rawData, game);
      this.InitSprite(game, this.data.position.x, this.data.position.y);
      this.Bind.Texture(this.textureId);
      this.drawIndex = 10;
    }

    MapPiece.Load = function(game) {
      game.Load.Texture("Assets/Art/map/bush.png", "bush");
      game.Load.Texture("Assets/Art/map/water.png", "water");
      game.Load.Texture("Assets/Art/map/branch.png", "branch");
      game.Load.Texture("Assets/Art/map/light-grass.png", "light-grass");
      return game.Load.Texture("Assets/Art/map/bumps.png", "bumps");
    };

    MapPiece.prototype.GetData = function(rawData, game) {
      var SCALE, data;
      SCALE = 64;
      data = {};
      data.position = {
        x: parseInt(rawData[0], 16) * SCALE,
        y: parseInt(rawData[1], 16) * SCALE
      };
      return data;
    };

    MapPiece.prototype.Update = function() {
      MapPiece.__super__.Update.call(this);
      if (this.hp <= 0) {
        return this.Die();
      }
    };

    MapPiece.prototype.Die = function() {
      this.emitter = this.game.Particles.ParticleEmitter(500, 0, 0, true, this.textureId, {
        spread: 20,
        gravity: 0.0001,
        minAngle: 0,
        maxAngle: Math.PI * 2,
        minScale: 0.1,
        maxScale: 0.5,
        minVelocity: 0.01,
        maxVelocity: 0.01,
        minAlphaDecay: 400,
        maxAlphaDecay: 450,
        minOmega: 0.001,
        maxOmega: 0.001
      });
      this.emitter.auto = false;
      this.emitter.position = this.position.Clone();
      this.Trash();
      return this.emitter.EmitParticles(true);
    };

    return MapPiece;

  })(Torch.Sprite);

  Bush = (function(superClass) {
    extend(Bush, superClass);

    function Bush() {
      return Bush.__super__.constructor.apply(this, arguments);
    }

    Bush.prototype.textureId = "bush";

    Bush.prototype.hp = Infinity;

    return Bush;

  })(MapPiece);

  PlayerStart = (function(superClass) {
    extend(PlayerStart, superClass);

    function PlayerStart() {
      return PlayerStart.__super__.constructor.apply(this, arguments);
    }

    PlayerStart.prototype.textureId = "player-start";

    return PlayerStart;

  })(MapPiece);

  Water = (function(superClass) {
    extend(Water, superClass);

    function Water() {
      return Water.__super__.constructor.apply(this, arguments);
    }

    Water.prototype.textureId = "water";

    Water.prototype.identifier = 1;

    return Water;

  })(MapPiece);

  Branch = (function(superClass) {
    extend(Branch, superClass);

    function Branch() {
      return Branch.__super__.constructor.apply(this, arguments);
    }

    Branch.prototype.textureId = "branch";

    Branch.prototype.identifier = 2;

    return Branch;

  })(MapPiece);

  LightGrass = (function(superClass) {
    extend(LightGrass, superClass);

    function LightGrass() {
      return LightGrass.__super__.constructor.apply(this, arguments);
    }

    LightGrass.prototype.hardBlock = false;

    LightGrass.prototype.textureId = "light-grass";

    LightGrass.prototype.identifier = 3;

    return LightGrass;

  })(MapPiece);

  Bumps = (function(superClass) {
    extend(Bumps, superClass);

    function Bumps() {
      return Bumps.__super__.constructor.apply(this, arguments);
    }

    Bumps.prototype.hardBlock = false;

    Bumps.prototype.textureId = "bumps";

    Bumps.prototype.identifier = 4;

    return Bumps;

  })(MapPiece);

  exports.MapPieces = {
    MapPiece: MapPiece,
    Bush: Bush,
    Water: Water,
    Branch: Branch,
    LightGrass: LightGrass,
    Bumps: Bumps
  };

}).call(this);
