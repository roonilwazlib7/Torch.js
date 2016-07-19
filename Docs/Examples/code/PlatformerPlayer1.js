//first, let's define a player
var Player = function(game, x, y)
{
    this.InitSprite(game, x, y);
    //now we can bind the texture
    this.Bind.Texture("mario");
}
Player.is(Torch.Sprite).is(Torch.Platformer.Actor); //inherit classes


Player.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate(); //make sure to call this

    //lets allow the player to move around
    var keys = that.game.Keys;
    if (keys.LeftArrow.down) that.Body.x.velocity = -1; //physics
    else if (keys.RightArrow.down) that.Body.x.velocity = 1;
    else that.Body.x.velocity = 0;
}


//now create the game
var Game = new Torch.Game("canvas", 700,500, "TestGame");
function Load()
{   //lets get the texture in here
    Game.Load.Texture("Assets/mario.png", "mario");
}
function Update()
{

}
function Draw()
{

}
function Init()
{
    Game.Clear("#6699ff");
    //create the player
    var player = new Player(Game, 50, 50);
}

Game.Start(Load, Update, Draw, Init);
