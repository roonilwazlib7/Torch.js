// Generated by CoffeeScript 1.10.0
(function() {
  var Draw, Game, Init, Load, Update;

  Torch.StrictErrors();

  Torch.DisableConsoleWarnings();

  Game = new Torch.Game("container", "fill", "fill", "TheGame", Torch.CANVAS);

  Load = function(game) {
    game.Bounds();
    game.Load.Texture("Art/player.png", "player");
    game.Load.Texture("Art/map/bush.png", "bush");
    game.Load.Texture("Art/map/water.png", "water");
    game.Load.Texture("Art/hud_background.png", "hud_background");
    game.Load.Texture("Art/hud_minimap_background.png", "hud_minimap_background");
    game.Load.Texture("Art/health_bar.png", "hud_life_bar");
    game.Load.Texture("Art/stress_bar.png", "hud_stress_bar");
    game.Load.Texture("Art/hud_slot_1_background.png", "hud_slot_1_background");
    game.Load.Texture("Art/hud_slot_2_background.png", "hud_slot_2_background");
    return game.Load.File("Maps/test-map-2.map", "map");
  };

  Init = function(game) {
    game.Clear("#fcd8a8");
    game.PixelScale();
    Torch.Scale = 4;
    window._game = game;
    game.player = new Player(game);
    game.mapManager = new MapManager(game);
    game.hud = new HUD(game);
    return game.mapManager.LoadMap("map");
  };

  Draw = function(game) {};

  Update = function(game) {};

  Game.Start(Load, Update, Draw, Init);

}).call(this);