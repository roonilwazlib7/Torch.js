var Brain = function()
{
    var that = this;
    that.InitSprite(50,550);
    this.range = {left: 25, right: 200, top: 100, bottom: 200}

    Game.Add(that);
    that.Bind.Texture("brain");

    that.Rectangle.width *= 0.5;
    that.Rectangle.height *= 0.5;

    that.DrawParams = {rotation:0};
    that.fabTexts = [];
}

Brain.is(Torch.Sprite);

Brain.prototype.Update = function()
{
    var that = this;
    that.DrawParams.rotation += 0.0005 * Game.deltaTime;
}

Brain.prototype.Collect = function(fabText)
{
    var that = this;
    fabText.Rectangle.x = Math.random() * (that.range.right - that.range.left);
    fabText.Rectangle.y = 530 + Math.random() * (that.range.bottom - that.range.top);
    fabText.Update = function(){};
}
