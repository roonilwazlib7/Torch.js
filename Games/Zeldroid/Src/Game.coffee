Torch.StrictErrors()
Torch.DisableConsoleWarnings()

zeldroid = new Zeldroid("container", "fill", "fill", "TheGame", Torch.CANVAS)


Load = (game) ->
    game.Bounds()

    Player.Load(game)
    HUD.Load(game)

    game.Load.Texture("Assets/Art/map/bush.png", "bush")
    game.Load.Texture("Assets/Art/map/water.png", "water")
    game.Load.Texture("Assets/Art/map/branch.png", "branch")
    game.Load.Texture("Assets/Art/map/light-grass.png", "light-grass")
    game.Load.File("Maps/test-map-2.map", "map")

Init = (game) ->
    game.Clear("#fcd8a8")
    game.PixelScale()
    Torch.Scale = 4
    game.player = new Player(game)
    game.mapManager = new MapManager(game)
    game.hud = new HUD(game)

    game.Keys.L.On "KeyDown", ->
        game.Tweens.Add(game.player, 1000, Torch.Easing.Smooth)
            .From({opacity: 1})
            .To({opacity: 0})
            .On "Finish", (event) -> alert("done")

    game.Keys.P.On "KeyDown", ->
        game.Tweens.Add(game.player, 1000, Torch.Easing.Smooth)
            .From({rotation: 0})
            .To({rotation: 2 * Math.PI})

    game.Keys.K.On "KeyDown", ->
        game.Tweens.Add(game.player.Size.scale, 1000, Torch.Easing.Smooth)
            .From({width: 1, height: 1})
            .To({width: 4, height: 4})

    game.Keys.I.On "KeyDown", ->
        game.Tweens.All (t) -> t.Trash()

    game.mapManager.LoadMap("map")
    game.debugCondole = new Torch.DebugConsole(game)
    game.debugCondole.AddCommand "SPAWN", (tConsole, x, y) ->
        # ...

Draw = (game)->

Update = (game) ->
    if game.deltaTime > 1000/50 then alert("FPS Dipped! #{game.deltaTime}")

zeldroid.Start(Load, Update, Draw, Init)
window.zeldroid = zeldroid
