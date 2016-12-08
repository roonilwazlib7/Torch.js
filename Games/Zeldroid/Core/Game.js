// Generated by CoffeeScript 1.10.0
(function() {
  var Draw, Init, Load, Update, zeldroid;

  Torch.StrictErrors();

  Torch.DisableConsoleWarnings();

  zeldroid = new Zeldroid("container", "fill", "fill", "TheGame", Torch.CANVAS);

  Load = function(game) {
    game.Bounds();
    Player.Load(game);
    HUD.Load(game);
    game.Load.Texture("Assets/Art/map/bush.png", "bush");
    game.Load.Texture("Assets/Art/map/water.png", "water");
    game.Load.Texture("Assets/Art/map/branch.png", "branch");
    game.Load.Texture("Assets/Art/map/light-grass.png", "light-grass");
    return game.Load.File("Maps/test-map-2.map", "map");
  };

  Init = function(game) {
    game.Clear("#fcd8a8");
    game.PixelScale();
    Torch.Scale = 4;
    game.player = new Player(game);
    game.mapManager = new MapManager(game);
    game.hud = new HUD(game);
    game.Keys.L.On("KeyDown", function() {
      return game.Tweens.Add(game.player, 1000, Torch.Easing.Smooth).From({
        opacity: 1
      }).To({
        opacity: 0
      }).On("Finish", function(event) {
        return alert("done");
      });
    });
    game.Keys.P.On("KeyDown", function() {
      return game.Tweens.Add(game.player, 1000, Torch.Easing.Smooth).From({
        rotation: 0
      }).To({
        rotation: 2 * Math.PI
      });
    });
    game.Keys.K.On("KeyDown", function() {
      return game.Tweens.Add(game.player.Size.scale, 1000, Torch.Easing.Smooth).From({
        width: 1,
        height: 1
      }).To({
        width: 4,
        height: 4
      });
    });
    game.Keys.I.On("KeyDown", function() {
      return game.Tweens.All(function(t) {
        return t.Trash();
      });
    });
    game.Keys.Z.On("KeyDown", function() {
      var emitter;
      return emitter = game.Particles.ParticleEmitter(500, 500, 1000, true, "bush", {
        spread: 20,
        gravity: 0.0001,
        minRadius: 1,
        maxRadius: 2,
        minAngle: 0,
        maxAngle: Math.PI * 2,
        minScale: 1,
        maxScale: 2,
        minVelocity: 0.3,
        maxVelocity: 0.3,
        minAlphaDecay: 1000,
        maxAlphaDecay: 1500,
        minOmega: 0.001,
        maxOmega: 0.002
      });
    });
    game.mapManager.LoadMap("map");
    game.debugCondole = new Torch.DebugConsole(game);
    return game.debugCondole.AddCommand("SPAWN", function(tConsole, x, y) {});
  };

  Draw = function(game) {};

  Update = function(game) {
    if (game.deltaTime > 1000 / 50) {
      return alert("FPS Dipped! " + game.deltaTime);
    }
  };

  zeldroid.Start(Load, Update, Draw, Init);

  window.zeldroid = zeldroid;

}).call(this);
