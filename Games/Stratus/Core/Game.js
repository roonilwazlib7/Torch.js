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

    Game.mapManager.LoadMap("test-map", {x: 320, y: 600});
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
    StartButton.CenterVertical().On("MouseOver", function()
    {
        StartButton.Opacity(0.6);

    }).On("MouseLeave", function()
    {
        StartButton.Opacity(1);

    }).On("Click", function()
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
    function Load(game)
    {
        game.Load.File(__dirname + "/Maps/test-map.txt", "test-map");
        game.Load.File(__dirname + "/Maps/test-map-2.txt", "test-map-2");
        game.Load.File(__dirname + "/config.json", "Config");
        game.Load.TextureSheet("Art/player-walk/player_walk.png", "player_walk_right", 32, 16, 16, 16);
        game.Load.TextureSheet("Art/player-walk/player_walk_left.png", "player_walk_left", 32, 16, 16, 16);
        game.Load.Texture([
            ["Art/player.png", "player_right"],
            ["Art/player_left.png", "player_left"]
        ]);
        game.Load.Texture("Art/hand.png", "hand");
        game.Load.Texture("Art/short-sword.png", "short-sword");
        game.Load.Texture("Art/short-sword-left.png", "short-sword-left");
        game.Load.Texture("Art/play-button.png", "start-button");
        game.Load.Texture("Art/main-logo.png", "main-logo");
        game.Load.Texture("Art/status-bar.png", "status-bar");
        game.Load.Texture("Art/health-bar.png", "health-bar");
        game.Load.Texture("Art/health-bar-background.png", "health-bar-background");
        game.Load.Texture("Art/game-over.png", "game-over");
        game.Load.Texture("Art/continue.png", "continue");
        game.Load.Texture("Art/mouse.png", "mouse");

        game.Load.Texture("Art/faker-black.png", "faker-black");
        game.Load.Texture("Art/faker-red.png", "faker-red");
        game.Load.Texture("Art/glower.png", "glower");

        Factory.Load();

        game.Load.Sound("Sound/hurt.wav", "player-hurt");
        game.Load.Sound("Sound/villager-alert.wav", "villager-alert")

        game.Load.Sound("Sound/ResistorAnthems2012/Resistor Anthems/09 Come and Find Me - B mix.mp3", "ascending");
        game.Load.Sound("Sound/someday.mp3", "someday");
        game.Load.Sound("Sound/twelve-fifty-one.mp3", "twelve-fifty-one");
        game.Load.Sound("Sound/under-darkness.mp3", "under-darkness");
        game.Load.Sound("Sound/hard-to-explain.mp3", "hard-to-explain");
        game.Load.Sound("Sound/reptilla.mp3", "reptilla");
        game.Load.Sound("Sound/mr-brightside.mp3", "mr-brightside");
        game.Load.Sound("Sound/buddy-holly.mp3", "buddy-holly");
        game.Load.Sound("Sound/today.mp3", "today");
        game.Load.Sound("Sound/more-than-a-feeling.mp3", "more-than-a-feeling");
        game.Load.Sound("Sound/no-rest.mp3", "no-rest");
    }
    function Update(game)
    {
        Lighter.Update();
    }
    function Draw(game)
    {

    }
    function Init(game)
    {
        game.PixelScale().Clear("#000");
        Config = JSON.parse(game.Files["Config"]);
        game.mapManager = new MapManager().AddMap("test-map", game.File(Config.STARTING_MAP) );

        if (Config.SHOW_DEBUG)
        {
            debug = new DebugInfo(game, 10, 10, {});
            debug.DrawIndex(9000).Color("green").Font("monospace")
                                .FontSize(12).FontWeight("bold")
                                .ToggleFixed(true);
        }
        if (Config.PLAY_SOUND)
        {
            SamplePlayList = new Torch.Sound.PlayList(game, ["ascending","someday",
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
