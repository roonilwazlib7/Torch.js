var Bullet = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.Bind.Texture("bullet");
    this.Velocity("y", -1);
    this.On("OutOfBounds", function(sprite)
    {
        sprite.Trash();
    });
    this.target = "";
}
Bullet.is(Torch.Sprite);

Bullet.prototype.Target = function(target)
{
    this.target = target;
}

Bullet.prototype.Update = function()
{
    var that = this;
    if (that.target == "player")
    {
        that.CollidesWith(player).AABB(function(bullet, player)
        {
            player.Hit(that);
            bullet.Explode();
        });
    }
    else if (that.target == "enemy")
    {
        var enemies = EnemyManager.Enemies();
        for (var i = 0; i < enemies.length; i++)
        {
            that.CollidesWith(enemies[i]).AABB(function(bullet, enemy)
            {
                enemy.Hit(that);
                bullet.Explode();
            });
        }
    }
}
