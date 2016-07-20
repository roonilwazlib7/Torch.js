
var Game = new Torch.Game("canvas", "fill","fill", "NewGame");
var TitleText, TitleText2, Spawner, player;
function Load()
{
    Game.Load.TextureSheet("Art/player-walk/player_walk.png", "player_walk_right", 48, 16, 16, 16);
    Game.Load.TextureSheet("Art/player-walk/player_walk_left.png", "player_walk_left", 48, 16, 16, 16);
    Game.Load.Texture("Art/player.png", "player_right");
    Game.Load.Texture("Art/player_left.png", "player_left");
    Game.Load.Texture("Art/brick.png", "basic-block");
    Game.Load.Texture("Art/short-sword.png", "short-sword");
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
    player = new Player(Game, 10, 170);
    player.SwitchItem(ShortSword);
    Spawner = new Torch.Platformer.Spawner(SpawnWorld());
}

Game.Start(Load, Update, Draw, Init);
