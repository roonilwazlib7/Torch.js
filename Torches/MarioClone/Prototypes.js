var PhysicsObject = function(){}
PhysicsObject.prototype.fallTime = 0;
PhysicsObject.prototype.blockBelow = false;
PhysicsObject.prototype.blockInFront = false;
PhysicsObject.prototype.blockInBack = false;
PhysicsObject.prototype.blockAbove = false;
PhysicsObject.prototype.PhysicsObject = function()
{
    var that = this;
    that.blockBelow = false;
    that.blockInFront = false;
    that.blockInBack = false;
    that.blockAbove = false;
    for (var i = 0; i < Spawner.SpawnScaffold.length; i++)
    {
        var item = Spawner.SpawnScaffold[i];
        var rect = that.Rectangle;
        if (item.spawned && item.Sprite && item.Sprite.BLOCK && that.NotSelf(item.Sprite) && that.PLAYER)
        {
            var offset = that.Rectangle.Intersects(item.Sprite.Rectangle);
            if (offset)
            {
                if (offset.vx < offset.halfWidths && offset.vy < offset.halfHeights)
                {
                    if (offset.x > offset.y)
                    {
                        if (offset.vy > 0)
                        {
                            //colDir = "t";
                            that.Rectangle.y += offset.y;
                        }
                        else
                        {
                            //colDir = "b";
                            that.Rectangle.y -= offset.y;
                            that.Body.y.acceleration = 0;
                        }

                    }
                    else
                    {
                        if (offset.vx > 0)
                        {
                            //colDir = "l";
                            that.Rectangle.x += offset.x;
                        }
                        else
                        {
                            //colDir = "r";
                            that.Rectangle.x -= offset.x;
                        }
                    }
                }
            }
        }
    }
}
