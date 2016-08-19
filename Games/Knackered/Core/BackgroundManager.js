var BackgroundManager = function(game)
{
    var bg = function()
    {
        this.InitSprite(game, 0, 0);
        this.Bind.Texture("background");
        this.Width(game.Viewport.width).Height(game.Viewport.height).DrawIndex(0);
        this.DrawIndex(-1);
    }
    bg.is(Torch.Sprite);

    var bg1 = new bg();
    var bg2 = bg1.Clone();

    bg1.Velocity("y", 0.3);
    bg1.On("OutOfBounds", function(bg)
    {
        bg1.Position("x", 0).Position("y", 0);
    });

    bg2.Update = function()
    {
        var that = this;
        that.UpdateSprite();
        that.Position("x", bg1.Position("x"))
            .Position("y", bg1.Position("y") - bg1.Height());
    }

}
