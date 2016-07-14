
RunTests();

var Game = new Torch.Game("canvas", 1280,720, "NewGame");
function Load()
{
    Game.Load.Texture("Art/blood.png", "blood");
    Game.Load.Texture(Player.IdleUrl,  "player");
}
function Update()
{
}
function Draw()
{

}
function Init()
{
    RunInitTests();
    Game.Clear("green");
    Game.Gravity = 0.1;


    Game.Player = new Player(200,200);
}

Game.Start(Load, Update, Draw, Init);
