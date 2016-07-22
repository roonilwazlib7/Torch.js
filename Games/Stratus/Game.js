
var Game = new Torch.Game("canvas", "fill","fill", "NewGame");
var TitleText, TitleText2;
function Load()
{
    Game.Load.Texture("Art/player.png", "player");
    Game.Load.Texture("Art/brick.png", "basic-block");
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
    Torch.Scale = 4;
    Game.PixelScale();

    TitleText = new Torch.Text(Game, 100, 100,{
        color: "green",
        text: "Stratus",
        fontSize: 24,
        font: "monospace",
        fontWeight: "italic bold"
    });
    TitleText2 = new Torch.Text(Game, 100, 130,{
        color: "green",
        text: "A Kyle and Alex Production",
        fontSize: 24,
        font: "monospace"
    });

    TitleText.Center();
    TitleText2.Center();
    var player = new Player(Game, 10, 170);
    SpawnWorld();
}

Game.Start(Load, Update, Draw, Init);
