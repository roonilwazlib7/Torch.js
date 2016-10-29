Torch.StrictErrors();



var Game = new Torch.Game("container", "fill", "fill", "Void", Torch.WEBGL);

var blueLightMover = 0;

function Load(game)
{
    //textures
    game.Load.Texture("ship.png", "player");
    game.Load.Texture("player.png", "black");
}
function Init(game)
{
    Torch.Scale = 6;
    game.Bounds();
    game.Clear("black");

    var black = new Torch.Sprite(game, 0, 0);
    black.Bind.WebGLTexture("black");
    black.DrawIndex(2)

    game.player = new Player(game);
    game.player.DrawIndex(9);
    game.player.On("Click", function(){
        alert("clicked!");
    });

    //game.Add( new Torch.AmbientLight(0xffffff) );
}
function Draw(game)
{

}
function Update(game)
{
    if (game.Keys.Space.down)
    {
        game.player.gl_scene_object.scale.x = 3;
        //game.player.Width(600);
    }
}

Game.Start(Load, Update, Draw, Init);
