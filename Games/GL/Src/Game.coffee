Torch.StrictErrors()

Game = new Torch.Game("container", "fill", "fill", "Void", Torch.WEBGL)

blueLightMover = 0

Load = (game) ->
    game.Load.Texture("Art/ship.png", "player")
    game.Load.Texture("Art/player.png", "black")
    game.Load.Texture("Art/enemy.png", "enemy")
    game.Load.Texture("Art/bullet.png", "bullet")

Init = (game) ->
    Torch.Scale = 6
    window._game = game
    game.Bounds()
    game.Clear("black")

    # var black = new Torch.Sprite(game, 0, 0);
    # black.Bind.WebGLTexture("black");
    # black.DrawIndex(2)

    game.player = new Player(game)
    game.player.DrawIndex(9)
    game.player.Center()
    game.player.CenterVertical()

    game.origTest = new Torch.Sprite(game, game.canvasNode.width - 50, 0)
    game.origTest.Bind.WebGLTexture("enemy")
    game.origTest.DrawIndex(10)

    game.Add( new Torch.AmbientLight(0xffffff) )

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

Draw = (game)->

Update = (game) ->

Game.Start(Load, Update, Draw, Init)
