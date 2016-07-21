
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
    Game.Load.Texture("Art/short-sword-left.png", "short-sword-left");
    Game.Load.Texture("Art/play-button.png", "start-button");
    Game.Load.Texture("Art/main-logo.png", "main-logo");

    Game.Load.Sound("Sound/someday.mp3", "someday");
    Game.Load.Sound("Sound/twelve-fifty-one.mp3", "twelve-fifty-one");
    Game.Load.Sound("Sound/under-darkness.mp3", "under-darkness");
    Game.Load.Sound("Sound/hard-to-explain.mp3", "hard-to-explain");
    Game.Load.Sound("Sound/reptilla.mp3", "reptilla");
    Game.Load.Sound("Sound/mr-brightside.mp3", "mr-brightside");
    Game.Load.Sound("Sound/buddy-holly.mp3", "buddy-holly");
    Game.Load.Sound("Sound/today.mp3", "today");
    Game.Load.Sound("Sound/more-than-a-feeling.mp3", "more-than-a-feeling");
    Game.Load.Sound("Sound/no-rest.mp3", "no-rest");
}
function Update()
{
    if (Game.Keys.Q.down)
    {
        Game.spriteList = [];
        Init();
    }
    window.PlayList.Update();
}
function Draw()
{

}
function Init()
{
    Game.Clear("black");
    Torch.Scale = 2;
    Game.PixelScale();

    var StartButton = new Torch.Sprite(Game, 0, 450);
    StartButton.Bind.Texture("start-button");
    StartButton.Center();

    var StartLogo = new Torch.Sprite(Game, 0, 50);
    StartLogo.Bind.Texture("main-logo");
    StartLogo.Center();

    StartButton.MouseOver(function(){
        StartButton.opacity = 0.6;
    });
    StartButton.MouseLeave(function(){
        StartButton.opacity = 1;
    });

    StartButton.Click(function(){
        StartButton.Trash();
        StartLogo.Trash();
        Torch.Scale = 4;
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
        Spawner = new Torch.Platformer.Spawner(parseMapString(testMap));
    });
    window.PlayList = new Torch.Sound.PlayList(Game, ["someday", "no-rest", "twelve-fifty-one", "under-darkness", "hard-to-explain", "reptilla", "mr-brightside", "buddy-holly", "today", "more-than-a-feeling"]);
    window.PlayList.Randomize();
    window.PlayList.Play();
}

Game.Start(Load, Update, Draw, Init);
