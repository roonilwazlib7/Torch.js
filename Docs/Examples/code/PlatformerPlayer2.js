//this list represents all the objects
//in a Platformer world
var WORLD_SPAWN = [];

//define a block
var Block = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.Bind.Texture("block");
}
Block.is(Torch.Sprite).is(Torch.Platformer.Block);

//define a player
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
    //make sure to call this
    that.BaseUpdate();

    //inherited function that will handle interaction
    //with a Platformer environment
    that.UpdateActor();

    //lets allow the player to move around
    var keys = that.game.Keys;
    if (keys.LeftArrow.down) that.Body.x.velocity = -0.5; //physics
    else if (keys.RightArrow.down) that.Body.x.velocity = 0.5;
    else that.Body.x.velocity = 0;
    //and jump
    if (keys.J.down && that.onGround) //onGround is computed in UpdateActor
    {
        that.Body.y.velocity = -0.4;
    }
}


//now create the game
var Game = new Torch.Game("canvas", 700,500, "TestGame");

function Load()
{   //load the textures
    Game.Load.Texture("Assets/mario.png", "mario");
    Game.Load.Texture("Assets/BasicBlock.png", "block");
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
    //add it to the world
    WORLD_SPAWN.push({
        Sprite: player,
        spawned: true
    });
    //create some blocks and add them to the world
    var blocks = [];
    var x = 0;
    var y = 300;
    for (var i = 0; i < 30; i++)
    {
        var b = new Block(Game, x + (32*i), y);
        WORLD_SPAWN.push({
            Sprite: b,
            spawned: true
        });
    }
    //give Torch the world
    Torch.Platformer.SetWorld(WORLD_SPAWN);
}

Game.Start(Load, Update, Draw, Init);