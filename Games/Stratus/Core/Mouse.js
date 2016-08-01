var Mouse = function(game)
{
    this.InitSprite(game, 0, 0);
    this.Bind.Texture("mouse");
    this.drawIndex = 9000;
}
Mouse.is(Torch.Sprite);
Mouse.prototype.Update = function()
{
    var that = this;
    var rec = that.game.Mouse.GetRectangle(that.game);
    that.Rectangle.x = rec.x - (that.Rectangle.width / 4);
    that.Rectangle.y = rec.y - (that.Rectangle.height / 4);
}
