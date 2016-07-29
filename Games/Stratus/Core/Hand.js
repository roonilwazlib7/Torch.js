var Hand = function(actor, color)
{
    this.actor = actor;
    this.InitSprite(actor.game, actor.Rectangle.x, actor.Rectangle.y);
    this.pixlColor = color;
    this.CreateHand();
}
Hand.is(Torch.Sprite);
Hand.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.UpdatePosition();
}
Hand.prototype.CreateHand = function()
{
    var that = this;
    pixl.pixelSize = 1;
    var def = [
        "11",
        "11"
    ];
    var palette = {
        "1" : that.pixlColor
    };

    var texture = pixl(def, palette);
    var im = new Image();
    im.src = texture.src;
    im.onload = function()
    {
        that.Bind.Texture(im);
    }
}
Hand.prototype.UpdatePosition = function()
{
    var that = this;
    if (that.actor.facing == "right")
    {
        that.Rectangle.x = that.actor.Rectangle.x + (that.actor.Rectangle.width / 1.15);
    }
    else
    {
        that.Rectangle.x = that.actor.Rectangle.x;
    }
    that.Rectangle.y = that.actor.Rectangle.y + (that.actor.Rectangle.height / 2);
}
