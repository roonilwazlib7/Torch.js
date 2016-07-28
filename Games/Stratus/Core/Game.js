Torch.Electron.Import();
var Game = new Torch.Game("canvas", "fill","fill", "NewGame");
var TitleText, TitleText2, Spawner, player, debug, healthText;

var TestingEnemies = function()
{
    var villager = new Villager(Game, 500, 100);
    villager.MovementStateMachine.Switch(VillagerIdleState);
}

function Load()
{
    Game.Load.File(__dirname + "/Ideas/GameIdeas.txt", "game-ideas");
    Game.Load.TextureSheet("Art/player-walk/player_walk.png", "player_walk_right", 48, 16, 16, 16);
    Game.Load.TextureSheet("Art/player-walk/player_walk_left.png", "player_walk_left", 48, 16, 16, 16);
    Game.Load.Texture("Art/player.png", "player_right");
    Game.Load.Texture("Art/player_left.png", "player_left");
    Game.Load.Texture("Art/hand.png", "hand");
    Game.Load.Texture("Art/short-sword.png", "short-sword");
    Game.Load.Texture("Art/short-sword-left.png", "short-sword-left");
    Game.Load.Texture("Art/play-button.png", "start-button");
    Game.Load.Texture("Art/main-logo.png", "main-logo");
    Game.Load.Texture("Art/status-bar.png", "status-bar");

    Factory.Block.Load();
    Factory.Enemy.Load();

    Game.Load.Sound("Sound/hurt.wav", "player-hurt");
    Game.Load.Sound("Sound/villager-alert.wav", "villager-alert")

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

    var fps = Math.round(1000 / Game.deltaTime);
    debug.text = "fps: {0} : {1}".format(fps, Math.round(Game.time / 1000));

}
function Draw()
{

}
function Init()
{
    Game.Clear("#ccccb3");
    Game.PixelScale();
    Torch.Scale = 2;

    var StartButton = new Torch.Sprite(Game, 0, 450);
    StartButton.Bind.Texture("start-button");

    var StartLogo = new Torch.Sprite(Game, 0, 50);
    StartLogo.Bind.Texture("main-logo");

    StartButton.MouseOver(function(){
        StartButton.opacity = 0.6;
    });
    StartButton.MouseLeave(function(){
        StartButton.opacity = 1;
    });
    debug = new Torch.Text(Game, 10, 10, {
        color: "green",
        font: "monospace",
        fontSize: 28,
        fontWeight: "bold",
        text: "0"
    });

    var StartMenu = new Torch.SpriteGroup([StartButton, StartLogo]);
    StartMenu.Center();

    StartButton.Click(function(){
        StartMenu.Trash();
        Torch.Scale = 4;

        var statusBar = new Torch.Sprite(Game, 0, Game.Viewport.height);
        statusBar.Bind.Texture("status-bar");
        statusBar.Rectangle.y -= statusBar.Rectangle.height;
        statusBar.Center();

        healthText = new Torch.Text(Game, 10, 10, {
            color: "white",
            font: "monospace",
            fontSize: 28,
            fontWeight: "bold",
            text: "0"
        });
        healthText.text = "100%";
        healthText.Rectangle.y = statusBar.Rectangle.y + healthText.Rectangle.height / 3;
        healthText.Rectangle.x = statusBar.Rectangle.x + 5;
        healthText.drawIndex = 100;

        player = new Player(Game, 10, 325);
        Spawner = new Torch.Platformer.Spawner(parseMapString(testMap));
        TestingEnemies();
    });
    window.PlayList = new Torch.Sound.PlayList(Game, ["someday", "twelve-fifty-one", "under-darkness", "hard-to-explain", "reptilla", "mr-brightside", "buddy-holly", "today", "more-than-a-feeling"]);
    //window.PlayList.Randomize();
    window.PlayList.Play();
}

Game.Start(Load, Update, Draw, Init);
