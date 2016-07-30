var Lighter = {};
Lighter.Init = function()
{
    var that = this;
    that.leftBlocker = new Torch.Sprite(Game, 0, 0);
    that.rightBlocker = new Torch.Sprite(Game, 0, 0);
    that.topBlocker = new Torch.Sprite(Game, 0, 0);
    that.bottomBlocker = new Torch.Sprite(Game, 0, 0);
    that.glower = new Torch.Sprite(Game, 0, 0);

    that.leftBlocker.Bind.Texture("faker-black");
    that.rightBlocker.Bind.Texture("faker-black");
    that.topBlocker.Bind.Texture("faker-black");
    that.bottomBlocker.Bind.Texture("faker-black");
    that.glower.Bind.Texture("faker-black");

    that.glower.Rectangle.x = (Game.Viewport.width / 2) - player.Rectangle.width;

    //that.leftBlocker.ToggleFixed();
    that.leftBlocker.Rectangle.width = that.glower.Rectangle.x;
    that.leftBlocker.Rectangle.height = Game.Viewport.height;
    that.leftBlocker.opacity = 0.9;
    that.leftBlocker.drawIndex = 7;

    that.leftBlocker.iX = that.leftBlocker.Rectangle.x;
    that.leftBlocker.iY = that.leftBlocker.Rectangle.y;

    //that.rightBlocker.ToggleFixed();
    that.rightBlocker.Rectangle.width = that.leftBlocker.Rectangle.width;
    that.rightBlocker.Rectangle.height = Game.Viewport.height;
    that.rightBlocker.Rectangle.x = (Game.Viewport.width / 2) + 4 * player.Rectangle.width;

    that.rightBlocker.iX = that.rightBlocker.Rectangle.x;
    that.rightBlocker.iY = that.rightBlocker.Rectangle.y;

    that.rightBlocker.opacity = 0.9;
    that.rightBlocker.drawIndex = 7;

    //that.topBlocker.ToggleFixed();
    that.topBlocker.Rectangle.x = that.leftBlocker.Rectangle.width;
    that.topBlocker.Rectangle.y = 0;

    that.topBlocker.iX = that.topBlocker.Rectangle.x;
    that.topBlocker.iY = that.topBlocker.Rectangle.y;

    that.topBlocker.Rectangle.width = 2.5 * ( Game.Viewport.width - (that.rightBlocker.Rectangle.width + that.leftBlocker.Rectangle.width) );
    that.topBlocker.Rectangle.height = (1/3) * Game.Viewport.height;
    that.topBlocker.opacity = 0.9;
    that.topBlocker.drawIndex = 7;

    //that.bottomBlocker.ToggleFixed();
    that.bottomBlocker.Rectangle.x = that.leftBlocker.Rectangle.width;
    that.bottomBlocker.Rectangle.y = 2 * ( (1/3) * Game.Viewport.height );

    that.bottomBlocker.iX = that.bottomBlocker.Rectangle.x;
    that.bottomBlocker.iY = that.bottomBlocker.Rectangle.y;

    that.bottomBlocker.Rectangle.width = 2.5 * ( Game.Viewport.width - (that.rightBlocker.Rectangle.width + that.leftBlocker.Rectangle.width) );
    that.bottomBlocker.Rectangle.height = (1/3) * Game.Viewport.height;
    that.bottomBlocker.opacity = 0.9;
    that.bottomBlocker.drawIndex = 7;
}
Lighter.Update = function()
{
    var that = this;
    var blockers = [that.leftBlocker, that.rightBlocker, that.topBlocker, that.bottomBlocker];

    for (var i = 0; i < blockers.length; i++)
    {
        var b = blockers[i];
        b.Rectangle.x = b.iX - player.Rectangle.x;
        b.Rectangle.y = b.iY + player.Rectangle.y;
    }
}
