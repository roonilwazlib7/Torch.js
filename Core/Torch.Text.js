var Torch.Text = function(x,y,data)
{
    this.InitSprite(x,y);
    this.data = data;
    this.Init();

    this.font = "Arial";
    this.fontSize = 16;
    this.fontWeight = "";
    this.color = "red";
    this.text = "";
    this.lastText = "";
}
Torch.Text.is(Torch.Sprite);

Torch.Text.prototype.Init = function()
{
    var that = this;
    if (that.data.font) that.font = that.data.font;
    if (that.data.fontSize) that.fontSize = that.data.fontWeight;
    if (that.data.fontWeight) that.fontWeight = that.data.fontWeight;
    if (that.data.color) that.color = that.data.color;
    if (that.data.text) that.text = that.data.text;
    if (that.data.rectangle) that.Rectangle = that.data.rectangle;
    that.Render
}

Torch.Text.prototype.Render = function()
{
    var that = this;
    var canvas,
        image;
    canvas = document.createElement("CANVAS");
    canvas.width = that.Rectangle.width;
    canvas.height = that.Rectangle.height;
    canvas.fillStyle = that.color;
    canvas.font = that.fontSize + "px " + that.font;
    canvas.fillText(that.text,0,0);
    //generate the image
    image = new Image(canvas.toDataUrl() );
    that.Bind.Texture(image);
}

Torch.Text.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    if (that.text != that.lastText)
    {
        that.Render();
    }
}
