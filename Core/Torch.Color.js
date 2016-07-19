var Torch = {};
Torch.Color = function(rOrHex, g, b, a)
{
    this.hex = "";
    this.Red = 0;
    this.Green = 0;
    this.Blue = 0;
    this.Alpha = 1;
    this.Init(rOrHex, g, b, a);
}

Torch.Color.prototype.Init = function(rOrHex, g, b, a)
{
    var that = this;
    if (g != undefined && g!= null)
    {
        //rgba values
        that.GetHexFromRGB(rOrHex, g, b, a);
    }
    else
    {
        //html color hash
        that.GetRGBFromHex(rOrHex);
    }
}

Torch.Color.prototype.GetHexadecimal = function(dec, a)
{
    var hexa = Math.round(dec * a).toString(16);
    if (hexa.length == 1)
    {
        hexa = "0" + hexa
    }
    return hexa;
}

Torch.Color.prototype.GetHexFromRGB = function(r, g, b, a)
{
    var that = this;
    that.Red = r;
    that.Green = g;
    that.Blue = b;
    that.Alpha = a;
    that.hex = "#" + that.GetHexadecimal(r,a) + that.GetHexadecimal(g,a) + that.GetHexadecimal(b,a);
}

Torch.Color.prototype.GetRGBFromHex = function(hex)
{
    var that = this;
    var hexRed,
        hexBlue,
        hexGreen;
    that.hex = hex.split("#")[1];
    hexRed = that.hex.slice(0,2);
    hexGreen = that.hex.slice(2,4);
    hexBlue = that.hex.slice(4,6);
    that.Red = parseInt(hexRed, 16);
    that.Blue = parseInt(hexBlue, 16);
    that.Green = parseInt(hexGreen, 16);
    that.hex = '#' + that.hex;
}

Torch.Color.prototype.BlendHex = function()
{
    var that = this;
    that.GetRGBFromHex(that.hex);
}

Torch.Color.prototype.BlendRGB = function()
{
    var that = this;
    that.GetHexFromRGB(that.Red, that.Green. that.Blue, that.Alpha);
}

Torch.Color.prototype.GetRGBString = function()
{
    var that = this;
    return "rgba(" + that.Red + "," + that.Green + "," + that.Blue + "," + that.Alpha + ");";
}

//some default colors
Torch.Color.Red = new Torch.Color(256, 0, 0, 1);
Torch.Color.Green = new Torch.Color(0, 256, 0, 1);
Torch.Color.Blue = new Torch.Color(0, 0, 256, 1);
Torch.Color.Flame = new Torch.Color("#ff8000");
Torch.Color.Ruby = new Torch.Color("#e60000");
