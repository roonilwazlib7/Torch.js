var Powerup = function()
{
    this.InitSprite(0,0);
    this.POWERUP = true;
    this.draw = false;
    this.waitCount = 0;
    Game.Add(this);
    this.Bind.Texture("powerup");
    this.DrawParams = {rotation:0};

    var scale = 0.25;
    this.Rectangle.width = scale * this.DrawTexture.width;
    this.Rectangle.height = scale * this.DrawTexture.height;
}
Powerup.is(Torch.Sprite);

Powerup.prototype.Update = function()
{
    var that = this;
    that.waitCount += Game.deltaTime;

    if (that.waitCount > 10000)
    {
        //make avaliable
        that.draw = true;
        that.Rectangle.x += Game.deltaTime * 0.5;
        that.DrawParams.rotation += Game.deltaTime * 0.004;

        if (that.Rectangle.x >= 1900) that.Reset();
    }
}
Powerup.prototype.Reset = function()
{
    var that = this;
    that.waitCount = 0;
    that.draw = false;
    that.Rectangle.x = 0;
}
Powerup.prototype.Hit = function()
{
    var that = this;
    that.stop = true;
    Game.Player.powerCoolOff = 0;
    that.Reset();
    Game.Assets.GetSound("powerup_sound").toggle();
}
