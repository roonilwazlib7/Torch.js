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
    game.Load.Texture("Assets/Art/map/bumps.png", "bumps")
    game.Load.Texture("Assets/Art/particle.png", "particle")
    game.Load.File("Maps/test-map-2.map", "map-1")
    game.Load.File("hud.xml", "hud-xml")

Init = (game) ->
    game.Clear("#FB8500")
    game.PixelScale()
    Torch.Scale = 4
    game.player = new Player(game)
    game.mapManager = new MapManager(game)
    game.hud = new HUD(game)
    game.hudGrid = new Torch.SpriteGrid(game, game.File("hud-xml"))

    game.Keys.I.On "KeyDown", ->
        game.Tweens.Tween(game.Camera.position, 500, Torch.Easing.Smooth).To({x: -500})

    emitter = game.Particles.ParticleEmitter 500, 500, 500, true, "particle",
        spread: 20
        gravity: 0.0001
        minAngle: 0.2
        maxAngle: 0.5
        minScale: 4
        maxScale: 6
        minVelocity: 0.01
        maxVelocity: 0.01
        minAlphaDecay: 1000
        maxAlphaDecay: 1500
        minOmega: 0.001
        maxOmega: 0.001
    emitter.auto = false

    game.Keys.Z.On "KeyDown", ->
        emitter.EmitParticles()


    game.mapManager.LoadMap("map-1")
    game.debugCondole = new Torch.DebugConsole(game)
    game.debugCondole.AddCommand "SPAWN", (tConsole, x, y) ->
        # ...

Draw = (game)->

Update = (game) ->
    if game.deltaTime > 1000/50 then alert("FPS Dipped! #{game.deltaTime}")

zeldroid.Start(Load, Update, Draw, Init)
window.zeldroid = zeldroid
