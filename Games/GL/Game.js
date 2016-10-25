Torch.StrictErrors();



var Game = new Torch.Game("container", "fill", "fill", "Knackered", Torch.WEBGL);

var blueLightMover = 0;

function Load(game)
{
        //textures
    game.Load.Texture("enemy.png", "player");
    game.Load.Texture("player.png", "black");
}
function Init(game)
{
    game.Bounds();
    game.Clear("green");

    // var black = new Torch.Sprite(game, -500, 500);
    // black.Bind.WebGLTexture("black");
    //black.DrawIndex(10)

    game.player = new Player(game);
    game.player.DrawIndex(10)

    game.blueLight = new Torch.PointLight( 0x0000ff, 1, 100);
    game.Add( game.blueLight )

    game.Add( new Torch.AmbientLight(0xffffff) );
}
function Draw(game)
{

}
function Update(game)
{
    blueLightMover += 0.1

    game.blueLight.light.position.x = 75 * Math.cos(blueLightMover);
    game.blueLight.light.position.y = 75 * Math.sin(blueLightMover);
}

Game.Start(Load, Update, Draw, Init);
