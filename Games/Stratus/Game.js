
var Game = new Torch.Game("canvas", "fill","fill", "NewGame");
var TitleText, TitleText2;
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
    TitleText2 = new Torch.Text(Game, 100, 130,{
        color: "green",
        text: "A Kyle and Alex Production",
        fontSize: 24,
        font: "monospace"
    });

    TitleText.Center();
    TitleText2.Center();
}

Game.Start(Load, Update, Draw, Init);
