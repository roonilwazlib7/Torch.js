var Hand = function(actor, color)
{
    this.actor = actor;
    this.InitSprite(actor.game, 0, 0);
    this.pixlColor = color;
    this.CreateHand();
    this.offset = {x: 0, y: 0};
    this.punchingRight = false;
    this.punchingLeft = false;
    this.finishingPunchRight = false;
    this.finishingPunchLeft = false;
}
Hand.is(Torch.Sprite);
Hand.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.UpdatePosition();
    that.UpdateOffset();
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
        that.Rectangle.x = that.offset.x + that.actor.Rectangle.x + (that.actor.Rectangle.width / 1.15);
    }
    else
    {
        that.Rectangle.x = that.offset.x + that.actor.Rectangle.x;
    }
    if (that.actor.walkingLeft || that.actor.walkingRight)
    {
        that.offset = {x: 0, y: 0};
    }
    that.Rectangle.y = that.offset.y + that.actor.Rectangle.y + (that.actor.Rectangle.height / 2);
}
Hand.prototype.UpdateOffset = function()
{
    var that = this;
    that.update_PunchRight();
    that.update_PunchLeft();
}
Hand.prototype.PunchLeft = function()
{
    var that = this;
    that.punchingLeft = true;
}
Hand.prototype.PunchRight = function()
{
    var that = this;
    that.punchingRight = true;
}
Hand.prototype.update_PunchRight = function()
{
    var that = this;
    if (that.punchingRight)
    {
        if (!that.finishingPunchRight)
        {
            console.log("punching...");
            that.offset.x += 0.6 * that.game.deltaTime;
            if (that.offset.x >= 35)
            {
                that.finishingPunchRight = true;
            }
        }
        else
        {
            that.offset.x -= 0.4 * that.game.deltaTime;
            if (that.offset.x <= 0)
            {
                that.punchingRight = false;
                that.finishingPunchRight = false;
                that.offset = {x: 0, y: 0};
            }
        }
    }
}
Hand.prototype.update_PunchLeft = function()
{
    var that = this;
    if (that.punchingLeft)
    {
        if (!that.finishingPunchLeft)
        {
            console.log("punching...");
            that.offset.x -= 0.6 * that.game.deltaTime;
            if (that.offset.x <= -35)
            {
                that.finishingPunchLeft = true;
            }
        }
        else
        {
            that.offset.x += 0.4 * that.game.deltaTime;
            if (that.offset.x >= 0)
            {
                that.punchingLeft = false;
                that.finishingPunchLeft = false;
                that.offset = {x: 0, y: 0};
            }
        }
    }
}
