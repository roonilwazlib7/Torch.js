// Generated by CoffeeScript 1.10.0
(function() {
  var Draw, Game, Init, Load, Update;

  Torch.StrictErrors();

  Torch.DisableConsoleWarnings();

  Game = new Torch.Game("container", "fill", "fill", "TheGame", Torch.WEBGL);

  Load = function(game) {
    game.Bounds();
    game.Load.Texture("Art/player.png", "player");
    return game.Load.Texture("Art/map/bush.png", "bush");
  };

  Init = function(game) {
    var player, test;
    window._game = game;
    Torch.Scale = 6;
    game.Add(new Torch.AmbientLight(0xffffff));
    player = new Player(game);
    return test = new MapPieces.Bush(game, ["ff", "ff"]);
  };

  Draw = function(game) {};

  Update = function(game) {};

  Game.Start(Load, Update, Draw, Init);

}).call(this);
