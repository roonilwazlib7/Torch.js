Torch.StrictErrors()
Torch.DisableConsoleWarnings()

zeldroid = new Zeldroid("container", "fill", "fill", "TheGame", Torch.CANVAS)


Load = (game) ->
    game.Bounds()

    Player.Load(game)
    HUD.Load(game)

    game.Load.Texture("Assets/Art/map/bush.png", "bush")
    game.Load.Texture("Assets/Art/map/water.png", "water")
    game.Load.File("Maps/test-map-2.map", "map")

Init = (game) ->
    game.Clear("#fcd8a8")
    game.PixelScale()
    Torch.Scale = 4
    game.player = new Player(game)
    game.mapManager = new MapManager(game)
    game.hud = new HUD(game)

    #game.mapManager.LoadMap("map")
    game.debugCondole = new Torch.DebugConsole(game)
    game.debugCondole.AddCommand "SPAWN", (tConsole, x, y) ->
        # ...

Draw = (game)->

Update = (game) ->

zeldroid.Start(Load, Update, Draw, Init)
window.zeldroid = zeldroid
