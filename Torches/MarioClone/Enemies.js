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
    var bump = 10;
    if (player.Rectangle.x < that.Rectangle.x )player.Rectangle.x -= bump;
    else player.Rectangle.x += bump;

    if (player.PLAYER)
    {
        player.MoveState = "Idle";
        player.Bind.Texture("player");
        player.LockMovement();
        var time = 0;
        var startY = player.Rectangle.y;
        player.Collision = function()
        {
            var dif = Math.abs( startY - player.Rectangle.y )
            if (!player.blockAbove && dif < 30)
            {
                player.Rectangle.y -= player.jumpSpeed * (time * time);
                player.Rectangle.x -= player.jumpSpeed * time * 50;
                time += Game.deltaTime
            }
            else
            {
                player.Collision = null;
            }
        }
    }
}
