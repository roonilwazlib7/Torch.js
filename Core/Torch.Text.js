var cnv = document.createElement("CANVAS");
cnv.width = 500;
cnv.height = 500;
Torch.measureCanvas = cnv.getContext("2d");
Torch.Text = function(game,x,y,data)
{
    this.InitSprite(game,x,y);
    this.data = data;

    this.font = "Arial";
    this.fontSize = 16;
    this.fontWeight = "";
    this.color = "red";
    this.text = "";
    this.lastText = "";
    this.width = 100;
    this.height = 100;
    this.Init();
}
Torch.Text.is(Torch.Sprite);

Torch.Text.prototype.Init = function()
{
    var that = this;
    if (that.data.font) that.font = that.data.font;
    if (that.data.fontSize) that.fontSize = that.data.fontSize;
    if (that.data.fontWeight) that.fontWeight = that.data.fontWeight;
    if (that.data.color) that.color = that.data.color;
    if (that.data.text) that.text = that.data.text;
    if (that.data.rectangle) that.Rectangle = that.data.rectangle;

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
    cnv.height = that.fontSize;
    console.log(cnv.height, cnv.width);
    canvas = cnv.getContext("2d");
    canvas.fillStyle = that.color;
    canvas.font = that.fontSize + "px " + that.font;
    canvas.fillText(that.text,0,that.fontSize);
    //generate the image
    image = new Image();
    image.src = cnv.toDataURL();
    image.onload = function()
    {
        that.Bind.Texture(image);
    }

}

Torch.Text.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    if (that.text != that.lastText)
    {
        that.Render();
        that.lastText = that.text;
    }
}

Torch.Text.prototype.Center = function()
{
    var that = this;
    var width = that.game.canvasNode.width;
    var height = that.game.canvasNode.height;
    var x = width / 2 - that.Rectangle.width/2;
    that.Rectangle.x = x;
}
