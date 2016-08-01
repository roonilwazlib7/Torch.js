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
    that.glower.Bind.Texture("glower");

    that.glower.Rectangle.x = (Game.Viewport.width / 2) - player.Rectangle.width;

    that.leftBlocker.ToggleFixed();
    that.leftBlocker.Rectangle.width = that.glower.Rectangle.x;
    that.leftBlocker.Rectangle.height = Game.Viewport.height;
    that.leftBlocker.drawIndex = 7;

    that.leftBlocker.iX = that.leftBlocker.Rectangle.x;
    that.leftBlocker.iY = that.leftBlocker.Rectangle.y;

    that.rightBlocker.ToggleFixed();
    that.rightBlocker.Rectangle.width = that.leftBlocker.Rectangle.width;
    that.rightBlocker.Rectangle.height = Game.Viewport.height;
    that.rightBlocker.Rectangle.x = (Game.Viewport.width / 2) + 4 * player.Rectangle.width;

    that.rightBlocker.iX = that.rightBlocker.Rectangle.x;
    that.rightBlocker.iY = that.rightBlocker.Rectangle.y;

    that.rightBlocker.drawIndex = 7;

    that.topBlocker.ToggleFixed();
    that.topBlocker.Rectangle.x = that.leftBlocker.Rectangle.width;
    that.topBlocker.Rectangle.y = 0;

    that.topBlocker.iX = that.topBlocker.Rectangle.x;
    that.topBlocker.iY = that.topBlocker.Rectangle.y;

    that.topBlocker.Rectangle.width = 2.5 * ( Game.Viewport.width - (that.rightBlocker.Rectangle.width + that.leftBlocker.Rectangle.width) );
    that.topBlocker.Rectangle.height = Game.Viewport.height;
    that.topBlocker.drawIndex = 7;

    that.bottomBlocker.ToggleFixed();
    that.bottomBlocker.Rectangle.x = that.leftBlocker.Rectangle.width;
    that.bottomBlocker.Rectangle.y = 2 * ( (1/10) * Game.Viewport.height );

    that.bottomBlocker.iX = that.bottomBlocker.Rectangle.x;
    that.bottomBlocker.iY = that.bottomBlocker.Rectangle.y;

    that.bottomBlocker.Rectangle.width = 2.5 * ( Game.Viewport.width - (that.rightBlocker.Rectangle.width + that.leftBlocker.Rectangle.width) );
    that.bottomBlocker.Rectangle.height = Game.Viewport.height;
    that.bottomBlocker.drawIndex = 7;

    that.glower.Rectangle.width = (Game.Viewport.width - that.leftBlocker.Rectangle.width) / 3;
    that.glower.Rectangle.height = that.glower.Rectangle.width;
    that.glower.drawIndex = 6;
}
Lighter.Update = function()
{
    var that = this;
    that.topBlocker.Rectangle.y = player.Rectangle.y - that.topBlocker.Rectangle.height - ( (1/9) * Game.Viewport.height );
    that.bottomBlocker.Rectangle.y = 1 + player.Rectangle.y + ( (1/3) * Game.Viewport.height ) - ( (1/6) * Game.Viewport.height);

    that.glower.Rectangle.width = that.rightBlocker.Rectangle.x - that.leftBlocker.Rectangle.width;
    that.glower.Rectangle.height = 1 + (0.9 * that.glower.Rectangle.width);

    that.glower.Rectangle.x = 4 + player.Rectangle.x + player.Rectangle.width - ( 0.575 * that.glower.Rectangle.width);
    that.glower.Rectangle.y = 0 + player.Rectangle.y - ( 0.4 * that.glower.Rectangle.height);
}
Lighter.SetLevel = function(level)
{
    var that = this;
    that.topBlocker.opacity = level;
    that.bottomBlocker.opacity = level;
    that.leftBlocker.opacity = level;
    that.rightBlocker.opacity = level;
    that.glower.opacity = level;
}
