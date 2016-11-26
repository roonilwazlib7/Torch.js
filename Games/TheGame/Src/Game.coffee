Torch.StrictErrors()
Torch.DisableConsoleWarnings()

Game = new Torch.Game("container", "fill", "fill", "TheGame", Torch.WEBGL)


Load = (game) ->
    game.Bounds()
    game.Load.Texture("Art/player.png", "player")
    game.Load.Texture("Art/map/bush.png", "bush")
Init = (game) ->
    window._game = game
    Torch.Scale = 6
    game.Add( new Torch.AmbientLight(0xffffff) )
    player = new Player(game)

    test = new MapPieces.Bush(game, ["ff", "ff"])
Draw = (game)->

Update = (game) ->

Game.Start(Load, Update, Draw, Init)
