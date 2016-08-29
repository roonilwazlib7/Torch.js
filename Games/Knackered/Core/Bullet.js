var Bullet = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.Bind.Texture("bullet");
    this.VELOCITY = 1;
    this.On("OutOfBounds", (sprite) =>
    {
        sprite.Trash();
    });
    this.DrawIndex(-1);
    this.target = "";
}
Bullet.is(Torch.Sprite);

Bullet.prototype.Target = function(target)
{
    var that = this;
    this.target = target;
    if (that.target == "player")
    {
        that.Velocity("y", that.VELOCITY);
    }
    else if (that.target == "enemy")
    {
        that.Velocity("y", -that.VELOCITY);
    }
    return this;
}

Bullet.prototype.Explode = function()
{
    var that = this;
    that.Velocity("x", 0).Velocity("y", 0);
    that.Bind.Texture("bullet-explode");
    that.game.Timer.SetFutureEvent(100, ()=>{
        that.Trash();
    });
}

Bullet.prototype.Update = function()
{
    var that = this;
    that.UpdateSprite();
    if (that.target == "player")
    {
        if (that.CollidesWith(player).AABB())
        {
            that.Explode();
        }
    }
    else if (that.target == "enemy")
    {
        var enemies = enemyManager.Enemies();
        for (var i = 0; i < enemies.length; i++)
        {
            if (that.CollidesWith(enemies[i]).AABB())
            {
                that.Explode();
            }
        }
    }
}
