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
    #game.player.Center()

    game.origTest = new Torch.Sprite(game, game.canvasNode.width - 50, 0)
    game.origTest.Bind.WebGLTexture("enemy")
    game.origTest.DrawIndex(10)

    game.Add( new Torch.AmbientLight(0xffffff) )

    # game.text = new Torch.Text game, 0, 0,
    #     text: "Hello, World"
    #     color: "white"
    #     fontSize: 64
    #     font: "Impact"
    #
    # game.text.Center()
    # game.text.DrawIndex(10)
    # game.text.On "Click", (event) ->
    #     alert("click")
    #     event.sprite.Rotation(Math.PI/2)

Draw = (game)->

Update = (game) ->

Game.Start(Load, Update, Draw, Init)
