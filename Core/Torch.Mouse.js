Torch.Mouse = function(game)
{
    this.x = 0;
    this.y = 0;
    this.down = false;
    this.game = game;
}
Torch.Mouse.prototype.SetMousePos = function(c, evt)
{
    var that = this;
    var rect = c.getBoundingClientRect();

    that.x = evt.clientX - rect.left;
    that.y = evt.clientY - rect.top;
}
Torch.Mouse.prototype.GetRectangle = function()
{
    var that = this;
    return new Torch.Rectangle(that.game.Mouse.x - that.game.Viewport.x, that.game.Mouse.y - that.game.Viewport.y, 5, 5);
}
