Torch.StrictErrors()

Game = new Torch.Game("container", "fill", "fill", "Void", Torch.WEBGL)

blueLightMover = 0

Load = (game) ->
    game.Load.Texture("Art/ship.png", "player")
    game.Load.Texture("Art/player.png", "black")
    game.Load.Texture("Art/enemy.png", "enemy")
    game.Load.Texture("Art/bullet.png", "bullet")
    game.Load.Texture("Art/logo.png", "logo")

Init = (game) ->
    Torch.Scale = 6
    window._game = game
    game.Bounds()
    game.Clear("black")
    game.Add( new Torch.AmbientLight(0xffffff) )

    logo = new Torch.Sprite(game, 0, 0)
    logo.Bind.WebGLTexture("logo")
    logo.Center().CenterVertical()

    testFontSize = 24

    tl = new Torch.Text game, 0, 0,
        text: "TL"
        color: "white"
        fontSize: testFontSize
        font: "Impact"
    tr = new Torch.Text game, window.innerWidth - 32, 0,
        text: "TR"
        color: "white"
        fontSize: testFontSize
        font: "Impact"
    bl = new Torch.Text game, 0, window.innerHeight - 32,
        text: "BL"
        color: "white"
        fontSize: testFontSize
        font: "Impact"
    br = new Torch.Text game, window.innerWidth - 32, window.innerHeight - 32,
        text: "BR"
        color: "white"
        fontSize: testFontSize
        font: "Impact"
    ce = new Torch.Text game, 0, 0,
        text: "CENTER"
        color: "white"
        fontSize: testFontSize
        font: "Impact"

    ce.CenterVertical().Center()

    game.player = new Player(game)
    game.player.DrawIndex(9)
    game.player.Center()
    game.player.CenterVertical()

    game.text = new Torch.Text game, 0, 0,
        text: "0"
        color: "white"
        fontSize: 64
        font: "Impact"

    game.text.Center()
    game.text.counter = 0

    game.text.On "Collision", (event) ->
        event.collider.Trash()
        event.self.Center()
        event.self.counter += 1
        event.self.text = event.self.counter

    game.Keys.H.On "KeyDown", ->
        alert("down")

    game.Keys.J.On "KeyUp", ->
        alert("up")

Draw = (game)->

Update = (game) ->

Game.Start(Load, Update, Draw, Init)
