var Enemy = function(){};
Enemy.is(Torch.Sprite).is(Torch.Platformer.Actor).is(SpawnItem);
Enemy.prototype.ENEMY = true;
Enemy.prototype.InitEnemy = function(position, startTexture)
{
    var that = this;
    that.InitSprite(position.x, position.y);
    Game.Add(that);
    that.Bind.Texture(startTexture);
    that.StateMachine = new Torch.StateMachine(that);
    that.Scale();
};
Enemy.prototype.Die = function()
{
    var that = this;
    that.StateMachine.Switch(GeneralDieState);
};
Enemy.prototype.UpdateEnemy = function()
{
    var that = this;
    that.BaseUpdate();
    that.StateMachine.Update();
    that.UpdateActor();
};
Enemy.prototype.Update = function()
{
    var that = this;
    that.UpdateEnemy();
}

var GeneralDieState = new Torch.StateMachine.State(
    //execute
    function(en)
    {
        //do something
        //explode();
    },
    //enter
    function(en)
    {

    },
    //end
    function(en)
    {

    }
);
function EnemyAssets(game)
{
    game.Load.Texture("Art/eye.png", "BouncyEye");
}
var BouncyEyeIdleState = new Torch.StateMachine.State(
    function(be)
    {
        if (be.onGround) be.Body.y.velocity = be.jumpSpeed;
    }, null, null
);

var BouncyEye = function(position)
{
    var that = this;
    that.InitEnemy(position, "BouncyEye");
    that.StateMachine.Switch(BouncyEyeIdleState);
    that.jumpSpeed = -0.55;
};
BouncyEye.is(Enemy);

var Troll = function(position)
{
    var that = this;
    that.InitEnemy(position, "Troll");
    that.StateMachine.Switch(TrolIdleState);
}
Troll.is(Enemy);
