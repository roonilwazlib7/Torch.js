Villager.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.UpdateActor();
    that.MovementStateMachine.Update();
    var offset = that.Rectangle.Intersects(player.Rectangle);
    if (offset && !player.hitLock)
    {
        //player.Rectangle.x -= offset.x;
        player.Body.y.velocity = -0.3;
        player.HitLock();
        //that.game.Assets.GetSound("player-hurt").play();

        if (player.Health > 0)
        {
            healthBar.Rectangle.width -= (5 * healthBar.inc);
            player.Health -= 20;
        }
    }
}
Villager.prototype.Right = function()
{
    var that = this;
    that.Body.x.velocity = 0.2;
    that.Bind.TextureSheet(that.Assets.Walk_Right, {step: 250});
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


        if (villager.GetDistance(player) < villager.Rectangle.width)
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
