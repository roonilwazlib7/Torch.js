var Explode = function(sprite)
{
    var data = pixl.util.DecomposeImage(sprite.DrawTexture.image).data;
    pixl.pixelSize = 2;
    var X = 0;
    var Y = 0;
    for (var i = 0; i < data.length; i += 4)
    {
        X+=pixl.pixelSize;
        if (X >= pixl.pixelSize * (data.length / sprite.Rectangle.width))
        {
            X = 0;
            Y+=pixl.pixelSize;
        }
        var pixelColor = new Torch.Color(data[i], data[i + 1], data[i + 2], 1);
        var image = new Image();
        image.src = pixl(["1"], {"1": pixelColor.hex}).src;
        var spr = new Torch.Sprite(sprite.game, Math.random() * 1000, Math.random() * 500);
        spr.Bind.Texture(image);
        spr.drawIndex = sprite.drawIndex;
        spr.Rectangle.x = X + sprite.Rectangle.x;
        spr.Rectangle.y = Y + sprite.Rectangle.y;
        var negY = Math.random() > 0.5 ? -1 : 1;
        var negX = Math.random() > 0.5 ? -1 : 1;
        var velocity = 3;
        spr.Body.x.velocity = 1 + Math.random() * velocity * negX;
        spr.Body.y.velocity = 1 + Math.random() * velocity * negY;
        spr.Update = function()
        {
            var that = this;
            that.UpdateSprite();
            that.opacity -= that.game.deltaTime * 0.001;
            if (that.opacity <= 0)
            {
                that.Trash();
            }
        }
    }
    pixl.pixelSize = 1;
}
