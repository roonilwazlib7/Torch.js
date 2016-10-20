Torch.StrictErrors();



var Game = new Torch.Game("container", "fill", "fill", "Knackered", Torch.WEBGL);


    function Load(game)
    {
        //textures
        game.Load.Texture("Art/player.png", "player");
    }
    function Init(game)
    {
        // game.Clear("#000");
        var sp = new Torch.Sprite(Game, 0, 0);
        console.log("--->sp")
        sp.Bind.WebGLTexture()
    }
    function Draw(game)
    {

    }
    function Update(game)
    {

    }

    Game.Start(Load, Update, Draw, Init);
