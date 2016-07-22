var Player = function(game, x, y)
{
    this.InitSprite(game, x, y);
    this.Bind.Texture("player");
}
Player.is(Torch.Sprite).is(Torch.Platformer.Actor);

Player.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.UpdateActor();

    //movement
    var velocity = 0.3;
    var keys = that.game.Keys;
    if (keys.D.down) that.Body.x.velocity = velocity;
    else if (keys.A.down) that.Body.x.velocity = -velocity;
    else that.Body.x.velocity = 0;
    if (keys.W.down && that.onGround) that.Body.y.velocity = -0.4;
}
