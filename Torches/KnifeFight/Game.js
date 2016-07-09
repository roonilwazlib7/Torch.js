
RunTests();

var Game = new Torch.Game("canvas", 1280,720, "NewGame");
function Load()
{
    Game.Load.Texture("Art/blood.png", "blood");
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
}

Game.Start(Load, Update, Draw, Init);
