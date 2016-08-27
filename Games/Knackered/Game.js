Torch.StrictErrors();

var Game, player, gameStage, enemyManager, backgroundManager, scoreManager;

Game = new Torch.Game("canvas", "fill", "fill", "Knackered");

function Knackered()
{
    function Load(game)
    {
        //textures
        game.Load.Texture("Art/enemy.png", "enemy");
        game.Load.Texture("Art/player.png", "player");
        game.Load.Texture("Art/bullet.png", "bullet");
        game.Load.Texture("Art/bullet-explode.png", "bullet-explode");
        game.Load.Texture("Art/background.svg", "background");
        //sounds
        game.Load.Sound("Sound/background-music.mp3", "background-music");
    }
    function Init(game)
    {
        game.Clear("#000");
        //set the limits of the game world to the viewport (i.e. the screen)
        game.Bounds();
        //start the game with no menu
        gameStage = new GameStage(game).Start("main");
        //play the background music and loop it
        //game.Sound("background-music").play();
    }
    function Draw(game)
    {

    }
    function Update(game)
    {

    }

    Game.Start(Load, Update, Draw, Init);
}

Knackered();
