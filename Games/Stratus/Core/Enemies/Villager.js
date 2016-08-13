Villager.prototype.Health = 2;
Villager.prototype.HURT_VELOCITY = 0.2;
Villager.prototype.CHASE_VELOCITY = 0.1;
Villager.prototype.START_CHASE_JUMP_VELOCITY = -0.3;
Villager.prototype.IDLE_STEP = 450;

Villager.prototype.Update = function()
{
    var that = this,
        offset;
    that.UpdateEnemy();
    offset = that.Rectangle.Intersects(player.HitBox);
    if (offset)
    {
        player.Hit(10);
    }
    that.OnHit = function(hitter)
    {
        var dir = hitter.actor.facing == Facing.Right ? 1 : -1;
        that.Body.Velocity("x", that.HURT_VELOCITY *  dir);
        that.Body.Velocity("y", -that.HURT_VELOCITY);
        that.StateMachine("movement").Switch("hurt");
    }
}
Villager.prototype.InitEnemy = function()
{
    var that = this;
    that.StateMachine("movement");
    that.StateMachine("movement").State("idle", VillagerIdleState);
    that.StateMachine("movement").State("chase", VillagerChaseState);
    that.StateMachine("movement").State("hurt", VillagerHurtState);
    that.Hand = new Hand(that, "#808080");
}

//states
var VillagerIdleState = new Torch.StateMachine.State(
    function(villager)
    {
        if (villager.GetDistance(player) <= 250)
        {
            villager.StateMachine("movement").Switch("chase");
        }
    },
    function(villager)
    {
        //enter
        villager.Body.Velocity("x", 0);
        villager.walking = Walking.None;
        if (villager.facing == Facing.Right)
        {
            villager.Bind.TextureSheet(villager.Assets.Right_Idle).Step(villager.IDLE_STEP, function(index)
            {

            });
        }
        else if (villager.facing == Facing.Left)
        {
            villager.Bind.TextureSheet(villager.Assets.Left_Idle).Step(villager.IDLE_STEP, function(index)
            {

            });
        }
    },
    function(villager)
    {
        //exit
    }
),
VillagerChaseState = new Torch.StateMachine.State(
    function(villager)
    {
        var directionToPlayer = villager.GetDirectionVector(player);
        if (directionToPlayer.x > 0)
        {
            if (villager.onGround)
            {
                villager.Body.Velocity("x", villager.CHASE_VELOCITY);
            }
            if (villager.walking != Walking.Right)
            {
                villager.walking = Walking.Right
                villager.facing = Facing.Right;
                villager.Bind.TextureSheet(villager.Assets.Walk_Right).Step(250);
            }
        }
        else if (directionToPlayer.x < 0)
        {
            if (villager.onGround) villager.Body.Velocity("x", -villager.CHASE_VELOCITY);
            if (villager.walking != Walking.Left)
            {
                villager.walking = Walking.Left;
                villager.facing = Facing.Left;
                villager.Bind.TextureSheet(villager.Assets.Walk_Left).Step(250);
            }
        }

        if (villager.GetDistance(player) < 10)
        {
            villager.Body.Velocity("x", 0);
            villager.walking = Walking.None;
        }
        else if (villager.GetDistance(player) > 250)
        {
            villager.StateMachine("movement").Switch("idle")
        }

    },
    function(villager)
    {
        //enter
        villager.Body.Velocity("y", villager.START_CHASE_JUMP_VELOCITY);
        //villager.game.Assets.GetSound("villager-alert").play();
    },
    function(villager)
    {

    }
),
VillagerHurtState = new Torch.StateMachine.State(
    function(villager)
    {
        //just wait a bit, then swing it back to normal
        villager.hurtCounter += villager.game.deltaTime;
        if (villager.hurtCounter >= 200)
        {
            villager.Body.Velocity("x", 0);
            villager.StateMachine("movement").Switch("idle");
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
