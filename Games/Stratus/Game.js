
var Game = new Torch.Game("canvas", "fill","fill", "NewGame");
var TitleText;
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
    Game.Clear("black");
    TitleText = new Torch.Text(Game, 100, 100,{
        color: "green",
        text: "Stratus",
        fontSize: 24,
        font: "monospace"
    });
    TitleText.Center();
}

Game.Start(Load, Update, Draw, Init);
