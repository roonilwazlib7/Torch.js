var PhysicsObject = function(){}
PhysicsObject.prototype.fallTime = 0;
PhysicsObject.prototype.blockBelow = false;
PhysicsObject.prototype.blockInFront = false;
PhysicsObject.prototype.blockInBack = false;
PhysicsObject.prototype.blockAbove = false;
PhysicsObject.prototype.PhysicsObject = function()
{
    var that = this;
    that.onGround = false;
    that.onRight = false;
    that.onLeft = false;
    for (var i = 0; i < Spawner.SpawnScaffold.length; i++)
    {
        var item = Spawner.SpawnScaffold[i];
        var rect = that.Rectangle;
        if (item.spawned && item.Sprite && item.Sprite.BLOCK && that.NotSelf(item.Sprite) && (that.PLAYER || that.ENEMY) )
        {
            var offset = that.Rectangle.Intersects(item.Sprite.Rectangle);
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
                            Torch.Message(offset.x);
                        }
                        else
                        {
                            //colDir = "r";
                            that.Rectangle.x -= offset.x;
                            that.Body.x.velocity = 0;
                            that.onRight = true;
                            Torch.Message(offset.x);
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
                        else
                        {
                            //colDir = "b";
                            that.Rectangle.y -= offset.y;
                            that.Body.y.acceleration = 0;
                            that.Body.y.velocity = 0;
                            that.onGround = true;
                        }
                    }
                }
            }
        }
    }
    if (!that.onGround) that.Body.y.acceleration = Game.Gravity;
}
