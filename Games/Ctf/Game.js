
RunTests();

var Game = new Torch.Game("canvas", "fill","fill", "NewGame");
function Load()
{
    PlayerLoad();
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
    Game.Clear("black");

    Game.Player = new Player(300,300);
}

Game.Start(Load, Update, Draw, Init);
