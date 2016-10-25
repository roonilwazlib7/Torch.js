Torch.StrictErrors();



var Game = new Torch.Game("container", "fill", "fill", "Knackered", Torch.WEBGL);

var blueLightMover = 0;

function Load(game)
{
    //textures
    game.Load.Texture("enemy.png", "player");
    game.Load.Texture("black.png", "black");
}
function Init(game)
{
    game.Bounds();
    game.Clear("black");

    var black = new Torch.Sprite(game, 0, 0);
    black.Bind.WebGLTexture("black");
    black.DrawIndex(2)

    var greenLight = new Torch.PointLight( 0xffffff, 1, 100);
    greenLight.light.position.x = -500;
    greenLight.light.position.y = 500;

    game.player = new Player(game);
    game.player.DrawIndex(9)

    game.blueLight = new Torch.PointLight( 0x0000ff, 1, 100);
    game.Add( game.blueLight )
    game.Add( greenLight )
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
