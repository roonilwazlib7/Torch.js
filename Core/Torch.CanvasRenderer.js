var CanvasRenderer = function(game)
{
    this.game = game;
}
CanvasRenderer.prototype.Render(sprite)
{
    var that = this;
    var game = that.game;

    viewRect = game.Viewport.GetViewRectangle(game);

    if (!rectangle.Intersects(viewRect)) return;

    game.canvas.save();

    var x = Math.round(sprite.Rectangle.x + game.Viewport.x);
    var y = Math.round(sprite.Rectangle.y + game.Viewport.y);
    var width = sprite.Rectangle.width;
    var height = sprite.Rectangle.height;

    var rotation = sprite.rotation;

    game.canvas.globalAlpha = sprite.opacity;

    game.canvas.translate(x + width / 2, y + height / 2);

    game.canvas.rotate(rotation);

    if (that.fixed)
    {
        DrawRec.x -= that.game.Viewport.x;
        DrawRec.y -= that.game.Viewport.y;
    }
    if (that.TexturePack)
    {
        that.game.Draw(that.GetCurrentDraw(), DrawRec, that.DrawParams);
    }
    else if (that.TextureSheet)
    {
        var Params = that.DrawParams ? Object.create(that.DrawParams) : {};
        var frame = that.GetCurrentDraw();
        Params.clipX = frame.clipX;
        Params.clipY = frame.clipY;
        Params.clipWidth = frame.clipWidth;
        Params.clipHeight = frame.clipHeight;
        Params.IsTextureSheet = true;
        Params.rotation = that.rotation;
        Params.alpha = that.opacity;
        that.game.Draw(that.DrawTexture, DrawRec, Params);
    }
    else if (that.DrawTexture)
    {
        var DrawParams = {
            alpha: that.opacity,
            rotation: that.rotation
        };
        that.game.Draw(that.GetCurrentDraw(), DrawRec, DrawParams);
    }

    if (params.IsTextureSheet)
    {
        game.canvas.drawImage(texture.image, params.clipX, params.clipY, params.clipWidth, params.clipHeight, -width/2, -height/2, rectangle.width, rectangle.height);
    }
    else
    {
        game.canvas.drawImage(texture.image, -width/2, -height/2, rectangle.width, rectangle.height);
    }

    game.canvas.rotate(0);
    game.canvas.globalAlpha = 1;

    game.canvas.restore();
}
