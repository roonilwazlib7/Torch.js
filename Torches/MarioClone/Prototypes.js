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
        if (item.spawned && item.Sprite && item.Sprite.BLOCK)
        {
            if (that.Rectangle.Intersects(item.Sprite.Rectangle) && (that.Rectangle.y + that.Rectangle.height - 10) < item.Sprite.Rectangle.y)
            {
                that.Rectangle.y = item.Sprite.Rectangle.y - that.Rectangle.height;
                that.blockBelow = true;
            }
            if (that.Rectangle.Intersects(item.Sprite.Rectangle) && (that.Rectangle.y + that.Rectangle.height - 5) > item.Sprite.Rectangle.y)
            {
                that.Rectangle.y = item.Sprite.Rectangle.y + that.Rectangle.height;
                that.blockAbove = true;
            }
            if (that.Rectangle.Intersects(item.Sprite.Rectangle) && item.Sprite.Rectangle.x > that.Rectangle.x)
            {
                that.blockInFront = true;
            }
            if (that.Rectangle.Intersects(item.Sprite.Rectangle) && item.Sprite.Rectangle.x < that.Rectangle.x)
            {
                that.blockInBack = true;
            }
        }
        else{
            if (item.Sprite && item.Sprite.ENEMY && that.NotSelf(item.Sprite) && that.Rectangle.Intersects(item.Sprite.Rectangle) )
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
