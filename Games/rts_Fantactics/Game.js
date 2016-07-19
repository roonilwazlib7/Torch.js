
RunTests();

var Game = new Torch.Game("canvas", 1280,720, "NewGame");
function Load()
{

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
}

Game.Start(Load, Update, Draw, Init);
