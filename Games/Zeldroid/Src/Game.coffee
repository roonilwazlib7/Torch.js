Torch.StrictErrors()
Torch.DumpErrors()

zeldroid = new Torch.Game("container", "fill", "fill", "Zeldroid", Torch.CANVAS)
zeldroid.GetScale = ->
    return zeldroid.Camera.Viewport.width / 480


Load = (game) ->
    Player.Load(game)
    HUD.Load(game)
    MapPieces.MapPiece.Load(game)
    Enemy.Load(game)

    game.Load.Texture("Assets/Art/particle.png", "particle")
    game.Load.Texture("Assets/Art/line.png", "line")

    game.Load.File("Maps/test-map-2.map", "map-1")
    game.Load.File("package.json", "package")
    game.Load.Audio("Assets/Audio/shoot.wav", "shoot")
    game.Load.Audio("Assets/Audio/shoot-explode.wav", "shoot-explode")

    game.On "LoadProgressed", (event) ->
        #console.log(event.progress)

Init = (game) ->
    game.Clear("#00AF11")
    game.PixelScale()
    Torch.Scale = 4

    game.backgroundAudioPlayer = game.Audio.CreateAudioPlayer()

    game.player = new Player(game)
    game.mapManager = new MapManager(game)
    game.hud = new HUD(game)

    color = Torch.Color.Random().GetHtmlString()
    game.circ = new Torch.Shapes.Circle(game, 50, 50, 25, color, color)
    game.circ.drawIndex = 1000

    game.lin = new Torch.Shapes.Line(game, 0, 0, 500, 500, "black", {lineWidth: 5})
    game.lin.fixed = true
    game.lin.Bind.Texture("line")

    game.mapManager.LoadMap("map-1")
    SetUpConsoleCommands(game)

Draw = (game)->

Update = (game) ->
    if game.deltaTime > 1000/50 then alert("FPS Dipped! #{game.deltaTime}")

    if zeldroid.player?
        zeldroid.lin.endPosition = zeldroid.player.position.Clone()

zeldroid.Start
    Load: Load
    Update: Update
    Draw: Draw
    Init: Init

window.zeldroid = zeldroid


# initialization...
SetUpConsoleCommands = (game) ->
    game.debugCondole = new Torch.DebugConsole(game)
    game.debugCondole.AddCommand "SPAWN", (tConsole, piece, x, y) ->
        p = new MapPieces[piece](game, ["0", "0"])
        p.position.x = parseInt(x)
        p.position.y = parseInt(y)

        tConsole.game.Tweens.Tween(p, 500, Torch.Easing.Smooth).From({opacity: 0}).To({opacity: 1})

        console.log(p)

    game.debugCondole.AddCommand "UCAM", (tConsole) ->
        camVelocity = 1
        task =
            _torch_add: "Task"
            Execute: (game) ->
                if game.Keys.RightArrow.down
                    game.Camera.position.x -= camVelocity * game.Loop.updateDelta
                if game.Keys.LeftArrow.down
                    game.Camera.position.x += camVelocity * game.Loop.updateDelta
                if game.Keys.UpArrow.down
                    game.Camera.position.y += camVelocity * game.Loop.updateDelta
                if game.Keys.DownArrow.down
                    game.Camera.position.y -= camVelocity * game.Loop.updateDelta
        game.Task(task)
