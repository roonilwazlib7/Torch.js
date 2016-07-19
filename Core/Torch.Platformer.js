//planning on integrating this into a platformer physics library
//for torch


Torch.Platformer = {};
Torch.Platformer.Gravity = 0.001;
Torch.Platformer.SetWorld = function(spawnItems)
{
    Torch.Platformer.spawnItems = spawnItems;
}
Torch.Platformer.Actor = function(){} //anything that has any interaction
Torch.Platformer.Actor.prototype.ACTOR = true;
Torch.Platformer.Actor.prototype.Health = 100;
Torch.Platformer.Actor.prototype.currentFriction = 1;
Torch.Platformer.Actor.prototype.inFluid = false;
Torch.Platformer.Actor.prototype.onGround = false;
Torch.Platformer.Actor.prototype.onLeft = false;
Torch.Platformer.Actor.prototype.onTop = false;
Torch.Platformer.Actor.prototype.onRight = false;
Torch.Platformer.Actor.prototype.Hit = function(amount)
{
    var that = this;
    if (amount) that.Health -= amount;
    else that.Health -= 1;

    if (that.Health <= 0)
    {
        that.Die();
    }
}
Torch.Platformer.Actor.prototype.Die = function()
{
    var that = this;
    that.isDead = true;
}
Torch.Platformer.Actor.prototype.BlockCollision = function(item, offset)
{
    var that = this;
    if (offset)
    {
        if (offset.vx < offset.halfWidths && offset.vy < offset.halfHeights)
        {
            if (offset.x < offset.y && Math.abs(offset.x) >= 0.2)
            {
                that.Body.y.velocity = 0;
                if (offset.vx > 0)
                {
                    //colDir = "l";
                    that.Rectangle.x += offset.x;
                    that.Body.x.velocity = 0;
                    that.onLeft = true;
                }
                else
                {
                    //colDir = "r";
                    that.Rectangle.x -= offset.x;
                    that.Body.x.velocity = 0;
                    that.onRight = true;
                }

            }
            else
            {
                if (offset.vy > 0)
                {
                    //colDir = "t";
                    that.Rectangle.y += offset.y;
                    that.Body.y.velocity = 0;
                }
                else if ( Math.abs(offset.sharedXPlane) < 59 )
                {
                    //colDir = "b";
                    that.Rectangle.y -= (offset.y - item.Sprite.sink);
                    that.Body.y.acceleration = 0;
                    that.Body.y.velocity = 0;
                    that.onGround = true;
                    if (!that.inFluid) that.currentFriction = item.Sprite.friction;
                }
            }
        }
    }
}
Torch.Platformer.Actor.prototype.FluidCollision = function(item, offset)
{
    var that = this;
    if (offset)
    {
        that.currentFriction = item.Sprite.friction;
        that.Body.y.acceleration = item.Sprite.gravity;
        that.inFluid = true;
    }

}
Torch.Platformer.Actor.prototype.UpdateActor = function()
{
    var that = this;
    that.inFluid = false;
    that.onGround = false;
    that.onTop = false;
    that.onRight = false;
    that.onLeft = false;
    for (var i = 0; i < Torch.Platformer.spawnItems.length; i++)
    {
        var item = Torch.Platformer.spawnItems[i];
        var rect = that.Rectangle;
        if (item.spawned && item.Sprite && item.Sprite.BLOCK && that.NotSelf(item.Sprite) && (that.ACTOR) )
        {
            var offset = that.Rectangle.Intersects(item.Sprite.Rectangle);
            that.BlockCollision(item, offset);
        }
        if (item.spawned && item.Sprite && item.Sprite.FLUID && that.NotSelf(item.Sprite) && (that.ACTOR) )
        {
            var offset = that.Rectangle.Intersects(item.Sprite.Rectangle);
            that.FluidCollision(item, offset);
        }
        if (item.spawned && item.Sprite && item.Sprite.ENEMY && that.NotSelf(item.Sprite))
        {
            var offset = that.Rectangle.Intersects(item.Sprite.Rectangle);
            if (that.EnemyCollision && offset) that.EnemyCollision(item.Sprite, offset);
        }
        if (item.spawned && item.Sprite && item.Sprite.DOOR && that.NotSelf(item.Sprite) && that.PLAYER)
        {
            var offset = that.Rectangle.Intersects(item.Sprite.Rectangle);
            if (offset)
            {
                item.Sprite.SignGroup.Show();
                if (Game.Keys.G.down)
                {
                    //we're gonna want to clean this up
                    Spawner.UnSpawn();
                    Game.UnSpawn();
                    Spawner.Spawn(TestingWorld[item.Sprite.addData.Room]);
                    Game.Player.Rectangle.x = item.Sprite.addData.x || 0;
                    Game.Player.Rectangle.x = item.Sprite.addData.y || 0;
                }
            }
            else
            {
                item.Sprite.SignGroup.Hide();
            }
        }
    }
    if (!that.onGround && !that.inFluid) that.Body.y.acceleration = Torch.Platformer.Gravity;
}

Torch.Platformer.Block = function(){};
Torch.Platformer.Block.prototype.BLOCK = true;
Torch.Platformer.Block.prototype.friction = 1;
Torch.Platformer.Block.prototype.sink = 0;

Torch.Platformer.Fluid = function(){};
Torch.Platformer.Fluid.prototype.FLUID = true;
Torch.Platformer.Fluid.prototype.friction = 0.3;
Torch.Platformer.Fluid.prototype.gravity = 0.0001;
Torch.Platformer.Fluid.prototype.drawIndex = 30;
