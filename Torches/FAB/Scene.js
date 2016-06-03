var Scene = function()
{
    var that = this;
    that.width = Game.canvasNode.width;
    that.height = Game.canvasNode.height;
    that.LoadSprites();
}
Scene.prototype.LoadSprites = function()
{
    var that = this;
    that.background = new Torch.Sprite(0,0);

    Game.Add(that.background);
    that.background.Bind.Texture("background");

    that.background2 = new Torch.Sprite(0, -that.background.Rectangle.height);
    Game.Add(that.background2);
    that.background2.Bind.Texture("background");

    that.background2.drawIndex = -1;
    that.background.drawIndex = -1;
}
Scene.prototype.Update = function()
{
    var that = this;
    that.background.Rectangle.y += 0.3 * Game.deltaTime;

    that.background2.Rectangle.y = (that.background.Rectangle.y - that.background.Rectangle.height + 5);

    if (that.background.Rectangle.y >= that.background.Rectangle.height) that.background.Rectangle.y = 0;
}
