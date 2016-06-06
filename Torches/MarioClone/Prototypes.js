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
        if (item.spawned && item.Sprite && item.Sprite.BLOCK && that.NotSelf(item.Sprite))
        {
            if (that.Rectangle.Intersects(item.Sprite.Rectangle) && that.BoundingBox.y < item.Sprite.Rectangle.y)
            {
                that.Rectangle.y = item.Sprite.Rectangle.y - that.Rectangle.height;
                that.blockBelow = true;
            }
            if (that.BoundingBox.Intersects(item.Sprite.BoundingBox) && (that.BoundingBox.y + that.BoundingBox.height - 5) > item.Sprite.BoundingBox.y)
            {
                //that.Rectangle.y = item.Sprite.Rectangle.y + that.Rectangle.height;
                that.blockAbove = true;
            }
            if (that.BoundingBox.Intersects(item.Sprite.BoundingBox) && item.Sprite.BoundingBox.x > that.BoundingBox.x && that.BoundingBox.y > item.Sprite.Rectangle.y)
            {
                //that.Rectangle.x = item.Sprite.Rectangle.x - item.Sprite.Rectangle.width;
                that.blockInFront = true;
            }
            if (that.BoundingBox.Intersects(item.Sprite.BoundingBox) && item.Sprite.BoundingBox.x < that.BoundingBox.x)
            {
                that.blockInBack = true;
            }
        }
        else{
            if (item.Sprite && item.Sprite.ENEMY && that.NotSelf(item.Sprite) && that.BoundingBox.Intersects(item.Sprite.BoundingBox) )
            {
                item.Sprite.HandleActorCollision(that);
            }
        }
    }

    if (!that.blockBelow)
    {
        that.fallTime += Game.deltaTime;
        that.Rectangle.y += Game.GetGravity() * (that.fallTime * that.fallTime);
    }
    else
    {
        that.fallTime = 0;
    }
}
