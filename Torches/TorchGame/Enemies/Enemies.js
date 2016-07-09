var Enemy = function(){};
Enemy.is(Torch.Sprite).is(Torch.Platformer.Actor).is(SpawnItem);
Enemy.prototype.ENEMY = true;
Enemy.prototype.TouchDamage = 10;
Enemy.prototype.PlayerCollision = function(player){
    var that = this;
    player.Hit(that.TouchDamage);
    //that.Body.x.velocity *= -1;
    //that.Body.y.velocity *= -1;
}
Enemy.prototype.InitEnemy = function(position, startTexture, game)
{
    var that = this;
    that.InitSprite(position.x, position.y);
    if (game)
    {
        Game.Add(that);
        that.Bind.Texture(startTexture);
        that.Scale();
        //this.Body.y.acceleration = game.Gravity;
    }
    that.StateMachine = new Torch.StateMachine(that);
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
        en.draw = false;
        en.Trash();
        var blood = [];
        for (var i = 0; i < 50; i++)
        {
            var b = new Torch.Sprite(en.Rectangle.x, en.Rectangle.y);
            Game.Add(b);
            b.Bind.Texture("Blood");
            blood.push(b);
            var xDir = Math.random() > 0.5 ? 1 : -1;
            b.Body.x.velocity = xDir * ( Math.random() * 0.3 - 0.3);
            b.Body.y.velocity = 0.2 + Math.random() * 0.3;
            b.drawIndex = 100;
            b.Rectangle.width *= 4;
            b.Rectangle.height *= 4;
            b.PARTICLE = true;
            b.Update = function()
            {
                var that = this;
                that.BaseUpdate();
                for (var i = 0; i < Spawner.SpawnScaffold.length; i++)
                {
                    var item = Spawner.SpawnScaffold[i];
                    if (item.spawned && item.Sprite && item.Sprite.BLOCK)
                    {
                        var offset = that.Rectangle.Intersects( item.Sprite.Rectangle );
                        if (offset)
                        {
                            that.Body.x.velocity = 0;
                            that.Body.y.velocity = 0;
                        }
                    }
                }
            }
        }
        var sg = new Torch.SpriteGroup(blood);
        Torch.Timer.SetFutureEvent(5000, function(){
            sg.Trash();
        });
    },
    //end
    function(en)
    {

    }
);
function EnemyAssets(game)
{
    game.Load.Texture("Art/eye.png", "BouncyEye");
    game.Load.Texture("Art/blood.png", "Blood");
}
var BouncyEyeIdleState = new Torch.StateMachine.State(
    function(be)
    {

    }, null, null
);
var BouncyEyeChaseState = new Torch.StateMachine.State(
    function(be)
    {
        var distaceToPlayer = be.GetDistance(Game.Player);
        if (distaceToPlayer < 400)
        {
            var directionToPlayer = be.GetDirectionVector(Game.Player);
            be.Body.x.velocity = directionToPlayer.x * 0.1;
        }
        else
        {
            be.Body.x.velocity = 0;
        }
        if (be.onRight)
        {
            be.Body.x.velocity *= -1;
        }
        if (Game.Keys.K.down) {
            be.StateMachine.Switch(GeneralDieState);
        }
    }, null, null
)

var BouncyEye = function(position)
{
    var that = this;
    that.InitEnemy(position, "BouncyEye", Game);
    that.StateMachine.Switch(BouncyEyeChaseState);
    that.jumpSpeed = -0.45;

};
BouncyEye.is(Enemy);
BouncyEye.prototype.Update = function()
{
    var that = this;
    that.UpdateEnemy();
    if (that.onGround) that.Body.y.velocity = that.jumpSpeed;
    var offset = that.Rectangle.Intersects( Game.Player.Rectangle )
    if (offset)
    {
        //Game.Player.DrawParams.tint = "red";
    }
    //else Game.Player.tint = null;
}

var Troll = function(position)
{
    var that = this;
    that.InitEnemy(position, "Troll");
    that.StateMachine.Switch(TrolIdleState);
}
Troll.is(Enemy);
