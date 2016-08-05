Villager.prototype.Health = 2;
Villager.prototype.Update = function()
{
    var that = this;
    that.UpdateSprite();
    that.UpdateActor();
    that.UpdateEnemy();
    that.MovementStateMachine.Update();
    var offset = that.Rectangle.Intersects(player.HitBox);
    if (offset)
    {
        player.Hit(10);
    }
    that.OnHit = function(hitter)
    {
        var dir = hitter.actor.facing == "right" ? 1 : -1;
        that.Body.x.velocity = 0.2 *  dir;
        that.Body.y.velocity = -0.2;
        that.MovementStateMachine.Switch(VillagerHurtState);
    }
}
Villager.prototype.Right = function()
{
    var that = this;
    that.Body.x.velocity = 0.2;
    that.Bind.TextureSheet(that.Assets.Walk_Right, {step: 250});
}
Villager.prototype.InitEnemy = function()
{
    var that = this;
    that.Hand = new Hand(that, "#808080");
}

var VillagerIdleState = new Torch.StateMachine.State(
    function(villager)
    {
        if (villager.GetDistance(player) <= 250)
        {
            villager.MovementStateMachine.Switch(VillagerChaseState);
        }
    },
    function(villager)
    {
        //enter
        villager.Body.x.velocity = 0;
        villager.walking = "none";
        if (villager.facing == "right")
        {
            villager.Bind.TextureSheet(villager.Assets.Right_Idle, {step:350});
        }
        else
        {
            villager.Bind.TextureSheet(villager.Assets.Left_Idle, {step:350});
        }
    },
    function(villager)
    {
        //exit
    }
);

var VillagerChaseState = new Torch.StateMachine.State(
    function(villager)
    {
        var directionToPlayer = villager.GetDirectionVector(player);
        var velocity = 0.1;
        if (directionToPlayer.x > 0)
        {
            if (villager.onGround)villager.Body.x.velocity = velocity;
            if (villager.walking != "right")
            {
                villager.walking = "right";
                villager.facing = "right";
                villager.Bind.TextureSheet(villager.Assets.Walk_Right, {step:250});
            }
        }
        else if (directionToPlayer.x < 0)
        {
            if (villager.onGround) villager.Body.x.velocity = -velocity;
            if (villager.walking != "left")
            {
                villager.walking = "left";
                villager.facing = "left";
                villager.Bind.TextureSheet(villager.Assets.Walk_Left, {step:250});
            }
        }


        if (villager.GetDistance(player) < 10)
        {
            villager.Body.x.velocity = 0;
            villager.walking = "none";
        }
        else if (villager.GetDistance(player) > 250)
        {
            villager.MovementStateMachine.Switch(VillagerIdleState)
        }

    },
    function(villager)
    {
        //enter
        villager.Body.y.velocity = -0.3;
        //villager.game.Assets.GetSound("villager-alert").play();
    },
    function(villager)
    {

    }
);
var VillagerHurtState = new Torch.StateMachine.State(
    function(villager)
    {
        //just wait a bit, then swing it back to normal
        villager.hurtCounter += villager.game.deltaTime;
        if (villager.hurtCounter >= 200)
        {
            villager.Body.x.velocity = 0;
            villager.MovementStateMachine.Switch(VillagerIdleState);
        }
    },
    function(villager)
    {
        //villager.Body.x.velocity = 0;
        villager.hurtCounter = 0;
    },
    function(villager)
    {

    }
);
