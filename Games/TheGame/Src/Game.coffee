Torch.StrictErrors()
Torch.DisableConsoleWarnings()

Game = new Torch.Game("container", "fill", "fill", "TheGame", Torch.CANVAS)


Load = (game) ->
    game.Bounds()
    game.Load.Texture("Art/player.png", "player")
    game.Load.Texture("Art/map/bush.png", "bush")
    game.Load.Texture("Art/hud_background.png", "hud_background")
Init = (game) ->
    game.Clear("#fcd8a8")
    window._game = game
    Torch.Scale = 6
    game.Add( new Torch.AmbientLight(0xffffff) )
    player = new Player(game)
    hud = new HUD(game)

    test = new MapPieces.Bush(game, ["0", "0"])
Draw = (game)->

Update = (game) ->

Game.Start(Load, Update, Draw, Init)
