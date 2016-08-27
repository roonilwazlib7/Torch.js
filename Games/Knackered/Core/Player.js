var Player = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.Bind.Texture("player");
    this.Bullets = new Torch.SpriteGroup([], game).Factory(Bullet);
    this.MOVE_VELOCITY = 0.7;
    this.Position("y", game.Viewport.height - (this.Rectangle.height * 1.5) ).
         Center();
}
Player.is(Torch.Sprite);

Player.prototype.Update = function()
{
    var that = this;
    that.UpdateSprite();
    that.UpdateShooting();
    that.UpdateMovement();

    that.Rotation(that.GetAngle({Rectangle: that.game.Mouse.GetRectangle()}) + Math.PI);
}

Player.prototype.UpdateShooting = function()
{
    var that = this,
        keys;
    mouse = that.game.Mouse;
    if (!mouse.down && that.spaceWasDown)
    {
        var directionToMouse = that.GetDirectionVector({Rectangle: that.game.Mouse.GetRectangle()});
        var bullet = that.Bullets.Add(null, that.Position("x") + (that.Width() / 2),
                     that.Position("y") + (that.Height() / 2) );
        bullet.Target("enemy");
        bullet.Move("x", (-bullet.Width() / 2));
        bullet.Move("y", (-bullet.Height() / 2));
        bullet.Velocity("x", directionToMouse.x).Velocity("y", directionToMouse.y);
        bullet.Rotation(bullet.GetAngle({Rectangle: that.game.Mouse.GetRectangle()}));
    }
    if (mouse.down)
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

    if (keys.W.down)
    {
        that.Velocity("y", -that.MOVE_VELOCITY);
    }
    if (keys.S.down)
    {
        that.Velocity("y", that.MOVE_VELOCITY);
    }
    if (!keys.S.down &&!keys.W.down)
    {
        that.Velocity("y", 0);
    }
}
