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

Bullet.prototype.Update = function()
{
    var that = this;
    that.UpdateSprite();


}
