//planning on integrating this into a platformer physics library
//for torch


Torch.Platformer = {};
Torch.Platformer.Gravity = 0.001;
//this is for preventing the player from sticking
Torch.Platformer.SHIFT_COLLIDE_LEFT = 5;

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

Torch.Platformer.Actor.prototype.hitLockCounter = 0;
Torch.Platformer.Actor.prototype.hitLockBlinkCounter = 0;
Torch.Platformer.Actor.prototype.hitLock = false;
Torch.Platformer.Actor.prototype.hitLockMax = 1000;

Torch.Platformer.Actor.prototype.HitLock = function()
{
    var that = this;
    that.hitLock = true;
}


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
            if (offset.x < offset.y)
            {
                that.Body.Velocity("y", 0);
                if (offset.vx > 0)
                {
                    //colDir = "l"
                    if (!item.Sprite.Slope)
                    {
                        that.Rectangle.x += offset.x + Torch.Platformer.SHIFT_COLLIDE_LEFT;
                        that.Body.Velocity("x", 0);
                        that.onLeft = true;
                    }
                    else
                    {
                        that.BlockSlope(item.Sprite, offset);
                    }
                }
                else if (offset.vx < 0)
                {
                    //colDir = "r";
                    if (!item.Sprite.Slope)
                    {
                        that.Rectangle.x -= offset.x;
                        that.Body.Velocity("x", 0);
                        that.onRight = true;
                    }
                    else
                    {
                        that.BlockSlope(item.Sprite, offset);
                    }
                }

            }
            else if (offset.x > offset.y)
            {
                if (offset.vy > 0)
                {
                    //colDir = "t";
                    that.Rectangle.y += offset.y;
                    that.Body.Velocity("y", 0);
                }
                else if ( offset.vy < 0)
                {
                    //colDir = "b";
                    if (!item.Sprite.Slope)
                    {
                        that.Rectangle.y -= (offset.y - item.Sprite.sink);
                        that.Body.Acceleration("y", 0).Velocity("y", 0);
                        that.onGround = true;
                        if (!that.inFluid) that.currentFriction = item.Sprite.friction;
                    }
                    else
                    {
                        that.BlockSlope(item.Sprite, offset);
                    }
                }
            }
        }
    }
}
Torch.Platformer.Actor.prototype.BlockSlope = function(block, offset)
{
    var that = this;
    // //keep how far it's moved, but change y
     var Yoffset = offset.x * Math.tan(block.Slope);
    // that.Rectangle.y -= Yoffset;
    that.Rectangle.y = ( block.Rectangle.y + (block.Rectangle.height - Yoffset) - that.Rectangle.height );
    that.onSlope = true;
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
        if (!that.onGround && !that.inFluid) that.Body.y.acceleration = Torch.Platformer.Gravity;
    }
    if (that.hitLock)
    {
        that.hitLockCounter += Game.deltaTime;
        that.hitLockBlinkCounter += Game.deltaTime;
        if (that.hitLockBlinkCounter >= 200)
        {
            if (that.opacity == 0.1)
            {
                that.opacity = 0.8;
            }
            else
            {
                that.opacity = 0.1;
            }
            that.hitLockBlinkCounter = 0;
        }
        if (that.hitLockCounter >= that.hitLockMax)
        {
            that.hitLock = false;
            that.opacity = 1;
            that.hitLockCounter = 0;
            that.hitLockBlinkCounter = 0;
        }
    }
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

Torch.Platformer.Spawner = function(spawnItems)
{
    this.spawnItems = spawnItems;
    Torch.Platformer.SetWorld(spawnItems);
}
Torch.Platformer.Spawner.is(Torch.GhostSprite);
Torch.Platformer.Spawner.prototype.Update = function()
{
    var that = this;
    if(that.spawnItems.length > 0)
    {
        for (var i = 0; i < that.spawnItems.length; i++)
        {
            var item = that.spawnItems[i];
            var viewRect = Game.Viewport.GetViewRectangle();
            if (item.Manual) continue;
            if (!item.spawned && !item.dead && item.DisableDynamicSpawning)
            {
                var spr = that.SpawnTypes[item.SpawnType](item.Position, item, item.addData);
                item.Sprite = spr;
                item.spawned = true;
                spr.spawnItem = item;
            }
            else if (!item.spawned && !item.dead && viewRect.Intersects( {x: item.Position.x, y: item.Position.y, width: (item.width * Game.SCALE), height: (item.height * Game.SCALE)} ) )
            {
                if (item.SpawnType)
                {
                    var spr = that.SpawnTypes[item.SpawnType](item.Position, item, item.addData);
                    item.Sprite = spr;
                    item.spawned = true;
                    spr.spawnItem = item;
                }
            }
            else if (item.spawned && item.Sprite && item.Sprite.Rectangle && !viewRect.Intersects( {
                x: item.Sprite.Rectangle.x,
                y: item.Sprite.Rectangle.y,
                width: item.Sprite.Rectangle.width,
                height: item.Sprite.Rectangle.height} ) )
            {
                item.Sprite.Trash();
                item.Sprite = null;
                item.spawned = false;
            }

        }
    }
}

Torch.Platformer.SpawnItem = function(spawnType, spawned, obj, position)
{
    this.spawnType = spawnType;
    this.spawned = spawned;
    this.position = position;
    if (obj)
    {
        this.Sprite = obj;
    }
}

//enum for direction that an actor is facing
var Facing = {
    Right: 0,
    Left: 1
};
var Walking = {
    Right: 0,
    Left: 1,
    None: 2
}
