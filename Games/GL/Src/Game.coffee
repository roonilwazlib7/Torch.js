Torch.StrictErrors()

Game = new Torch.Game("container", "fill", "fill", "Void", Torch.WEBGL)

blueLightMover = 0

Load = (game) ->
    game.Load.Texture("Art/ship.png", "player")
    game.Load.Texture("Art/player.png", "black")
    game.Load.Texture("Art/enemy.png", "enemy")

Init = (game) ->
    Torch.Scale = 6;
    game.Bounds();
    game.Clear("black");

    # var black = new Torch.Sprite(game, 0, 0);
    # black.Bind.WebGLTexture("black");
    # black.DrawIndex(2)

    game.player = new Player(game)
    game.player.DrawIndex(9)

    game.origTest = new Torch.Sprite(game, 0, 0)
    game.origTest.Bind.WebGLTexture("enemy")
    game.origTest.DrawIndex(10)

    game.Add( new Torch.AmbientLight(0xffffff) )

Draw = (game)->

Update = (game) ->

Game.Start(Load, Update, Draw, Init)
