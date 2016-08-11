var Hand = function(actor, color)
{
    this.InitSprite(actor.game, 0, 0);
    this.actor = actor;
    this.pixlColor = color;
    this.CreateHand();
    this.offset = {x: 0, y: 0};
    this.punchingRight = false;
    this.punchingLeft = false;
    this.finishingPunchRight = false;
    this.finishingPunchLeft = false;
    this.striking = false;
}
Hand.is(Torch.Sprite);
Hand.prototype.Update = function()
{
    var that = this;
    that.UpdateSprite();
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
    that.pixlImage = im;
}
Hand.prototype.UpdatePosition = function()
{
    var that = this;
    if (that.actor.facing == Facing.Right)
    {
        that.Rectangle.x = that.offset.x + that.actor.Rectangle.x + (that.actor.Rectangle.width / 1.15);
    }
    else if (that.actor.facing == Facing.Left)
    {
        console.log("-->");
        that.Rectangle.x = that.offset.x + that.actor.Rectangle.x;
    }
    that.Rectangle.y = that.offset.y + that.actor.Rectangle.y + (that.actor.Rectangle.height / 2);
}
Hand.prototype.UpdateOffset = function()
{
    var that = this;
    that.update_PunchRight();
    that.update_PunchLeft();
    that.striking = that.punchingLeft || that.punchingRight;
    if (that.striking)
    {
        var sp = new Torch.Sprite(that.game, that.Rectangle.x, that.Rectangle.y);
        sp.Bind.Texture(that.pixlImage);
        sp.drawIndex = that.drawIndex;
        sp.Update = function()
        {
            sp.UpdateSprite();
            sp.opacity -= 0.009 * that.game.deltaTime;
            if (sp.opacity <= 0)
            {
                sp.Trash();
            }
        }
    }
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
