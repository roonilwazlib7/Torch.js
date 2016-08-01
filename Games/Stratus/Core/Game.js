Torch.Electron.Import();
var Game = new Torch.Game("canvas", "fill","fill", "NewGame");
var TitleText, TitleText2, Spawner, player, debug, healthText, healthBar;

var TestingEnemies = function()
{
    var villager = new Villager(Game, 500, 100);
    villager.MovementStateMachine.Switch(VillagerIdleState);
}
var StartGame = function()
{
    Game.PixelScale();
    Game.Clear("#000");
    Game.FlushSprites();
    Torch.Scale = 2;

    var StartLogo = new Torch.Sprite(Game, 0, 150);
    StartLogo.Bind.Texture("main-logo");

    var StartButton = new Torch.Sprite(Game, 0, 600);
    StartButton.Bind.Texture("start-button");
    StartButton.CenterVertical();

    StartButton.MouseOver(function(){
        StartButton.opacity = 0.6;
    });
    StartButton.MouseLeave(function(){
        StartButton.opacity = 1;
    });
    debug = new Torch.Text(Game, 10, 10, {
        color: "green",
        font: "monospace",
        fontSize: 12,
        fontWeight: "bold",
        text: "0"
    });
    debug.drawIndex = 9000;

    var StartMenu = new Torch.SpriteGroup([StartButton, StartLogo]);
    StartMenu.Center();
    StartMenu.ToggleFixed();

    StartButton.Click(function(){
        StartMenu.Trash();
        Torch.Scale = 4;

        var statusBar = new Torch.Sprite(Game, 0, Game.Viewport.height);
        statusBar.Bind.Texture("status-bar");
        statusBar.Rectangle.y -= statusBar.Rectangle.height;
        statusBar.Center();
        statusBar.ToggleFixed();
        statusBar.drawIndex = 8;

        healthBar = new Torch.Sprite(Game, 0, Game.Viewport.height);
        healthBar.Bind.Texture("health-bar");
        healthBar.Rectangle.y -= healthBar.Rectangle.height;
        healthBar.Rectangle.x = statusBar.Rectangle.x;
        healthBar.ToggleFixed();
        healthBar.inc = (healthBar.Rectangle.width / 100);
        healthBar.drawIndex = 10;

        var healthBarBackground = new Torch.Sprite(Game, 0, Game.Viewport.height);
        healthBarBackground.Bind.Texture("health-bar-background");
        healthBarBackground.Rectangle.y -= healthBarBackground.Rectangle.height;
        healthBarBackground.Rectangle.x = statusBar.Rectangle.x;
        healthBarBackground.ToggleFixed();
        healthBarBackground.drawIndex = 9;

        healthText = new Torch.Text(Game, 10, 10, {
            color: "white",
            font: "forward",
            fontSize: 24,
            fontWeight: "bold",
            text: "100",
            buffHeight: 5
        });
        healthText.Rectangle.y = statusBar.Rectangle.y + healthText.Rectangle.height / 1.5;
        healthText.Rectangle.x = statusBar.Rectangle.x + healthText.Rectangle.width;
        healthText.drawIndex = 100;
        healthText.ToggleFixed();


        player = new Player(Game, 10, 325);
        Spawner = new Torch.Platformer.Spawner(parseMapString(Game.Files["test-map"]));
        TestingEnemies();
        Lighter.Init();
        Lighter.SetLevel(0);

        Torch.Camera.Track(player);
        debug.ToggleFixed();
    });
    window.PlayList = new Torch.Sound.PlayList(Game, ["ascending","someday", "twelve-fifty-one", "under-darkness", "hard-to-explain", "reptilla", "mr-brightside", "buddy-holly", "today", "more-than-a-feeling"]);
    //window.PlayList.Randomize();
    //window.PlayList.Play();
}

function Load()
{
    Game.Load.File(__dirname + "/test-map.map", "test-map");
    Game.Load.TextureSheet("Art/player-walk/player_walk.png", "player_walk_right", 32, 16, 16, 16);
    Game.Load.TextureSheet("Art/player-walk/player_walk_left.png", "player_walk_left", 32, 16, 16, 16);
    Game.Load.Texture("Art/player.png", "player_right");
    Game.Load.Texture("Art/player_left.png", "player_left");
    Game.Load.Texture("Art/hand.png", "hand");
    Game.Load.Texture("Art/short-sword.png", "short-sword");
    Game.Load.Texture("Art/short-sword-left.png", "short-sword-left");
    Game.Load.Texture("Art/play-button.png", "start-button");
    Game.Load.Texture("Art/main-logo.png", "main-logo");
    Game.Load.Texture("Art/status-bar.png", "status-bar");
    Game.Load.Texture("Art/health-bar.png", "health-bar");
    Game.Load.Texture("Art/health-bar-background.png", "health-bar-background");
    Game.Load.Texture("Art/game-over.png", "game-over");
    Game.Load.Texture("Art/continue.png", "continue");

    Game.Load.Texture("Art/faker-black.png", "faker-black");
    Game.Load.Texture("Art/faker-red.png", "faker-red");
    Game.Load.Texture("Art/glower.png", "glower");

    Factory.Block.Load();
    Factory.Enemy.Load();

    Game.Load.Sound("Sound/hurt.wav", "player-hurt");
    Game.Load.Sound("Sound/villager-alert.wav", "villager-alert")

    Game.Load.Sound("Sound/ResistorAnthems2012/Resistor Anthems/09 Come and Find Me - B mix.mp3", "ascending");
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

    var fps = Game.fps;
    var avgFps = Game.averageFps;
    debug.text = "FPS:{0}  T:{1} avgFPS:{2}".format(fps, Math.ceil(Game.time / 1000), avgFps);

    if (player)
    {
        Lighter.Update();
    }

}
function Draw()
{

}
function Init()
{
    StartGame();
}

Game.Start(Load, Update, Draw, Init);
