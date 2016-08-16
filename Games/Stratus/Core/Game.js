Torch.Electron.Import(); //bring in the functionality allowed with electron
Torch.StrictErrors(); //catch all errors. If any error is thrown, the game is
                      //terminated and the error is reported

//declare a bunch of global variables
var Game, Config, TitleText, TitleText2, Spawner, SamplePlayList, player, debug,
    healthText, healthBar, healthBarBackground, statusBar;

//a little object to display debug info (fps, etc.)
var DebugInfo = function(game, x, y, data)
{
    this.InitText(game, x, y, data);
}
DebugInfo.is(Torch.Text);

DebugInfo.prototype.Update = function()
{
    var that = this,
        fps = Game.fps,
        avgFps = Game.averageFps;
    that.UpdateText();
    that.text = "FPS:{0}  T:{1} avgFPS:{2}".format(fps, Math.ceil(Game.time / 1000), avgFps);
    if (player != undefined)
    {
        that.text += " L:{0} R:{1} B:{2}".format(player.onLeft, player.onRight, player.onGround);
    }
}

var TestingEnemies = function()
{
    Villager.Make(Game, 500, 700).Clone(1000, 500)
                                 .Clone(100, 200).Clone(600,700);
}
var StartGamePlay = function()
{
    //this function starts actual game play
    Torch.Scale = 4;
    //status bar keeps track of progression
    statusBar = new StatusBar(Game);
    //bar to keep tack of health
    healthBar = new HealthBar(Game, statusBar);
    //a red background behind the health
    healthBarBackground = new HealthBarBackground(Game, statusBar);

    healthText = new Torch.Text(Game, 10, 10, {
        text: "100",
        buffHeight: 5
    }).Color("white").FontWeight("bold").FontSize(24).Font("forward");
    healthText.Rectangle.ShiftFrom(statusBar.Rectangle,
        healthText.Rectangle.width,
        healthText.Rectangle.height / 1.5);
    healthText.DrawIndex(100).ToggleFixed(true);

    player = new Player(Game, 120, 600);
    Spawner = new Torch.Platformer.Spawner(
        parseMapString( Game.Files[Config.STARTING_MAP] )
    );
    TestingEnemies();
    Lighter.Init();
    Lighter.SetLevel(0);

    //Torch.Camera.Track(player);
}
var StartGame = function()
{
    var StartLogo, StartButton, StartMenu;
    //this function starts the game with that start menu
    Game.FlushSprites();
    Torch.Scale = 2;

    StartLogo = new Torch.Sprite(Game, 0, 150);
    StartLogo.Bind.Texture("main-logo");

    StartButton = new Torch.Sprite(Game, 0, 600);
    StartButton.Bind.Texture("start-button");
    StartButton.CenterVertical().MouseOver(function()
    {
        StartButton.Opacity(0.6);

    }).MouseLeave(function()
    {
        StartButton.Opacity(1);

    }).Click(function()
    {
        StartMenu.Trash();
        StartGamePlay();
    });

    StartMenu = new Torch.SpriteGroup([StartButton, StartLogo]);
    StartMenu.Center().ToggleFixed();
}
var StartStratus = function()
{
    Game = new Torch.Game("canvas", "fill","fill", "NewGame");
    function Load()
    {
        Game.Load.File(__dirname + "/Maps/test-map.txt", "test-map");
        Game.Load.File(__dirname + "/config.json", "Config");
        Game.Load.TextureSheet("Art/player-walk/player_walk.png", "player_walk_right", 32, 16, 16, 16);
        Game.Load.TextureSheet("Art/player-walk/player_walk_left.png", "player_walk_left", 32, 16, 16, 16);
        Game.Load.Texture([
            ["Art/player.png", "player_right"],
            ["Art/player_left.png", "player_left"]
        ]);
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
        Game.Load.Texture("Art/mouse.png", "mouse");

        Game.Load.Texture("Art/faker-black.png", "faker-black");
        Game.Load.Texture("Art/faker-red.png", "faker-red");
        Game.Load.Texture("Art/glower.png", "glower");

        Factory.Load();

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
        Lighter.Update();
    }
    function Draw()
    {

    }
    function Init()
    {
        Game.PixelScale();
        Game.Clear("#000");
        Config = JSON.parse(Game.Files["Config"]);

        if (Config.SHOW_DEBUG)
        {
            debug = new DebugInfo(Game, 10, 10, {});
            debug.DrawIndex(9000).Color("green").Font("monospace")
                                .FontSize(12).FontWeight("bold")
                                .ToggleFixed(true);
        }
        if (Config.PLAY_SOUND)
        {
            SamplePlayList = new Torch.Sound.PlayList(Game, ["ascending","someday",
            "twelve-fifty-one", "under-darkness", "hard-to-explain",
            "reptilla", "mr-brightside", "buddy-holly",
            "today", "more-than-a-feeling"]).Randomize().Play();
        }
        if (Config.SHOW_MENU)
        {
            StartGame();
        }
        else
        {
            StartGamePlay();
        }
    }

    Game.Start(Load, Update, Draw, Init);
}
StartStratus();
