Torch.StrictErrors();



var Game = new Torch.Game("container", "fill", "fill", "Knackered", Torch.WEBGL);

var sp;
function Load(game)
{
        //textures
    game.Load.Texture("player.png", "player");
}
function Init(game)
{
    game.Bounds();
        // game.Clear("#000");
    sp = new Torch.Sprite(Game, 0, 0);
    sp.Bind.WebGLTexture();
}
function Draw(game)
{

}
function Update(game)
{
    // if (game.Keys.Space.down)
    // {
    //     sp.Move("x", 1);
    // }
}

Game.Start(Load, Update, Draw, Init);
