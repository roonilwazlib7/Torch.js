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
    game.Load.Texture("Assets/Art/map/bumps.png", "bumps");
    game.Load.Texture("Assets/Art/particle.png", "particle");
    game.Load.File("Maps/test-map-2.map", "map-1");
    game.Load.File("hud.xml", "hud-xml");
    game.Load.File("package.json", "package");
    return game.Load.Audio("Assets/Audio/shoot.wav", "shoot");
  };

  Init = function(game) {
    game.Clear("#00AF11");
    game.PixelScale();
    Torch.Scale = 4;
    game.player = new Player(game);
    game.mapManager = new MapManager(game);
    game.hud = new HUD(game);
    game.hudGrid = new Torch.SpriteGrid(game, game.File("hud-xml"));
    game.mapManager.LoadMap("map-1");
    game.debugCondole = new Torch.DebugConsole(game);
    game.debugCondole.AddCommand("SPAWN", function(tConsole, piece, x, y) {
      var p;
      p = new MapPieces[piece](game, ["0", "0"]);
      p.position.x = parseInt(x);
      p.position.y = parseInt(y);
      tConsole.game.Tweens.Tween(p, 500, Torch.Easing.Smooth).From({
        opacity: 0
      }).To({
        opacity: 1
      });
      return console.log(p);
    });
    return game.debugCondole.AddCommand("UCAM", function(tConsole) {
      var camVelocity, task;
      camVelocity = 1;
      task = {
        _torch_add: "Task",
        Execute: function(game) {
          if (game.Keys.RightArrow.down) {
            game.Camera.position.x -= camVelocity * game.Loop.updateDelta;
          }
          if (game.Keys.LeftArrow.down) {
            game.Camera.position.x += camVelocity * game.Loop.updateDelta;
          }
          if (game.Keys.UpArrow.down) {
            game.Camera.position.y += camVelocity * game.Loop.updateDelta;
          }
          if (game.Keys.DownArrow.down) {
            return game.Camera.position.y -= camVelocity * game.Loop.updateDelta;
          }
        }
      };
      return game.Task(task);
    });
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
