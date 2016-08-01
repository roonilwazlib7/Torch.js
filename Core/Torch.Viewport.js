Torch.Viewport = function(game)
{
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.maxWidth = $("body").width();
    this.maxHeight = $("body").height();
    this.rotation = 0;
    this.game = game;
}
Torch.Viewport.prototype.Update = function()
{
    var that = this;
    if (that.followSprite)
    {
        that.x = that.followSprite.origX - that.followSprite.Rectangle.x;
        that.y = that.followSprite.origY - that.followSprite.Rectangle.y;
    }
}
Torch.Viewport.prototype.Maximize = function()
{
    var that = this;
    var canvasElement = that.game.canvasNode;
    $(canvasElement).attr("width",that.game.Viewport.maxWidth);

    $(canvasElement).attr("height", that.game.Viewport.maxWidth * 0.5);

    that.width = that.game.Viewport.maxWidth;
    that.height = that.game.Viewport.maxWidth * 0.5;
}
Torch.Viewport.prototype.GetViewRectangle = function()
{
    var that = this.game//game;
    return new Torch.Rectangle(-that.Viewport.x, -that.Viewport.y, that.Viewport.width, that.Viewport.height);
}
