var cnv = document.createElement("CANVAS");
cnv.width = 500;
cnv.height = 500;
Torch.measureCanvas = cnv.getContext("2d");

Torch.Text = function(game,x,y,data)
{
    this.InitText(game, x, y, data);
}
Torch.Text.is(Torch.Sprite);

Torch.Text.prototype.TEXT = true;
Torch.Text.prototype.InitText = function(game, x, y, data)
{
    this.InitSprite(game,x,y);
    this.data = data;

    this.font = "Arial";
    this.fontSize = 16;
    this.fontWeight = "";
    this.color = "#2b4531";
    this.text = "";
    this.lastText = "";
    this.width = 100;
    this.height = 100;
    this.Init();
}
Torch.Text.prototype.Init = function()
{
    var that = this;
    if (that.data.font) that.font = that.data.font;
    if (that.data.fontSize) that.fontSize = that.data.fontSize;
    if (that.data.fontWeight) that.fontWeight = that.data.fontWeight;
    if (that.data.color) that.color = that.data.color;
    if (that.data.text) that.text = that.data.text;
    if (that.data.rectangle) that.Rectangle = that.data.rectangle;
    if (that.data.buffHeight) that.buffHeight = that.data.buffHeight;

    that.Render();
}

Torch.Text.prototype.Render = function()
{
    var that = this;
    var canvas,
        cnv,
        image;
    cnv = document.createElement("CANVAS");
    Torch.measureCanvas.font = that.fontSize + "px " + that.font;
    cnv.width = Torch.measureCanvas.measureText(that.text).width;
    cnv.height = that.fontSize + 5;
    if (that.buffHeight)
    {
        cnv.height += that.buffHeight;
    }
    canvas = cnv.getContext("2d");
    canvas.fillStyle = that.color;
    canvas.font = that.fontWeight + " " + that.fontSize + "px " + that.font;
    canvas.fillText(that.text,0,cnv.height);
    //generate the image
    image = new Image();
    image.src = cnv.toDataURL();
    image.onload = function()
    {
        that.Bind.Texture(image);
    }
    that.Rectangle.width = cnv.width;
    that.Rectangle.height = that.fontSize + 5;

}

Torch.Text.prototype.Update = function()
{
    var that = this;
    that.UpdateText();
}

Torch.Text.prototype.UpdateText = function()
{
    var that = this;
    that.UpdateSprite();
    if (that.text != that.lastText)
    {
        that.Render();
        that.lastText = that.text;
    }
}

Torch.Text.prototype.Text = function(text)
{
    var that = this;
    if (text == undefined)
    {
        return that.text
    }
    else
    {
        that.text = text;
        return that;
    }
}

Torch.Text.prototype.Font = function(font)
{
    var that = this;
    if (font == undefined)
    {
        return that.font
    }
    else
    {
        that.font = font;
        return that;
    }
}

Torch.Text.prototype.FontSize = function(fontSize)
{
    var that = this;
    if (fontSize == undefined)
    {
        return that.fontSize
    }
    else
    {
        that.fontSize = fontSize;
        return that;
    }
}

Torch.Text.prototype.FontWeight = function(fontWeight)
{
    var that = this;
    if (fontWeight == undefined)
    {
        return that.fontWeight;
    }
    else
    {
        that.fontWeight = fontWeight;
        return that;
    }
}

Torch.Text.prototype.Color = function(color)
{
    var that = this;
    if (color == undefined)
    {
        return that.color;
    }
    else
    {
        that.color = color;
        return that;
    }
}
