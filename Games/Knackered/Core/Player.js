var Player = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.Bind.Texture("player");
    this.Bullets = new Torch.SpriteGroup([], game).Factory(Bullet);
    this.MOVE_VELOCITY = 0.7;
    this.Position("y", game.Viewport.height - this.Rectangle.height).
         Center();
}
Player.is(Torch.Sprite);

Player.prototype.Update = function()
{
    var that = this;
    that.UpdateSprite();
    that.UpdateShooting();
    that.UpdateMovement();
}

Player.prototype.UpdateShooting = function()
{
    var that = this,
        keys;
    keys = that.game.Keys;
    if (!keys.Space.down && that.spaceWasDown)
    {
        var bullet = that.Bullets.Add(null, that.Position("x") + (that.Width() / 2), that.Position("y") - that.Height()) //builds a new instance of Bullet with factory
            .Target("enemy"); //set it to target enemies
        bullet.Move("x", (-bullet.Width() / 2));
    }
    if (keys.Space.down)
    {
        that.spaceWasDown = true;
    }
    else
    {
        that.spaceWasDown = false;
    }
}

Player.prototype.UpdateMovement = function()
{
    var that = this,
        keys;
    keys = that.game.Keys;
    if (keys.A.down)
    {
        that.Velocity("x", -that.MOVE_VELOCITY);
    }
    if (keys.D.down)
    {
        that.Velocity("x", that.MOVE_VELOCITY);
    }
    if (!keys.D.down && !keys.A.down)
    {
        that.Velocity("x", 0);
    }
}
