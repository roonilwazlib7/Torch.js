Torch.StrictErrors();



var Game = new Torch.Game("container", "fill", "fill", "Knackered", Torch.WEBGL);

var sp;
var blueLightMover = 0;

function Load(game)
{
        //textures
    game.Load.Texture("enemy.png", "player");
}
function Init(game)
{
    game.Bounds();
    game.Clear("green");
    sp = new Torch.Sprite(Game, 0, 0);
    sp.Bind.WebGLTexture("player");

    game.blueLight = new THREE.PointLight( 0x0000ff, 1, 100 )

    game.gl_scene.add( game.blueLight )
}
function Draw(game)
{

}
function Update(game)
{
     //sp.Move("x", 1);
    // if (game.Keys.Space.down)
    // {
    //     sp.Move("x", 1);
    // }
    blueLightMover += 0.1

    game.blueLight.position.x = 75 * Math.cos(blueLightMover);
    game.blueLight.position.y = 75 * Math.sin(blueLightMover);
}

Game.Start(Load, Update, Draw, Init);
