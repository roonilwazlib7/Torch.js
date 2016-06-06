var Goomba = function(x,y)
{
    this.InitSprite(150, 350);
    Game.Add(this);
    this.Bind.TextureSheet("goomba");
    this.ENEMY = true;
}
Goomba.is(Torch.Sprite).is(PhysicsObject);

Goomba.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.PhysicsObject();
}
Goomba.prototype.HandleActorCollision = function(player)
{
    var that = this;
    var bump = 25;
    if (player.Rectangle.x < that.Rectangle.x )player.Rectangle.x -= bump;
    else player.Rectangle.x += bump;

    if (player.PLAYER)
    {
        player.MoveState = "Idle";
        player.Bind.Texture("player");
        player.moveLocked = true;
    }
}
