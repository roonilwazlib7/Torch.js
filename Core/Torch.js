Function.prototype.is = function(otherFunction)
{
    var proto = this.prototype;
    var items = Object.create(otherFunction.prototype);
    for (key in items)
    {
        proto[key] = items[key];
    }
    return this; //allow chaining
}

String.prototype.format = function()
{
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number)
    {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};


window.onerror = function()
{
    if (!Torch.STRICT_ERRORS) return;
    var errorObj = arguments[4];
    if (errorObj != undefined)
    {
        Torch.FatalError(errorObj);
    }
    else
    {
        Torch.FatalError("An error has occured");
    }
}

var Torch =
{
    Message: function(message, color)
    {
        if ( $("#torch_message").length > 0 )
        {
            var message = $("<p>" + message + "</p>");
            message.css("font-weight", "bold");
            if (color) message.css("color", color);
            $("#torch_message").append(message);
        }
    },
    FatalError: function(error)
    {
        var that = this;

        if (that.fatal) return;
        that.fatal = true;

        if (typeof error == "string")
        {
            error = new Error(error);
        }

        document.body.backgroundColor = "black";
        var stack = error.stack.replace(/\n/g, "<br><br>");
        $("body").empty();
        $("body").prepend("<code style='color:#C9302C;font-size:20px'>" + stack + "</code><br>");
        $("body").prepend("<code style='color:#C9302C;margin-left:15%;font-size:24px'>" + error + "</code><br><code style='color:#C9302C;font-size:20px;font-weight:bold'>Stack Trace:</code><br>");
        throw error;
    },
    StrictErrors: function()
    {
        this.STRICT_ERRORS = true;
    }
};

Torch.Rectangle = function(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};
Torch.Rectangle.prototype.GetOffset = function(rectangle)
{
    var that = this;
    var vx = ( that.x + ( that.width / 2 ) ) - ( rectangle.x + ( rectangle.width / 2 ) );
    var vy = ( that.y + (that.height / 2 ) ) - ( rectangle.y + ( rectangle.height / 2 ) );
    var halfWidths = (that.width / 2) + (rectangle.width / 2);
    var halfHeights = (that.height / 2) + (rectangle.height / 2);
    var sharedXPlane = (that.x + that.width) - (rectangle.x + rectangle.width);
    var sharedYPlane = (that.y + that.height) - (rectangle.y + rectangle.height);

    return {
        x: halfWidths - Math.abs(vx),
        y: halfHeights - Math.abs(vy),
        vx: vx,
        vy: vy,
        halfWidths: halfWidths,
        halfHeights: halfHeights,
        sharedXPlane: sharedXPlane,
        sharedYPlane: sharedYPlane
    };
}
Torch.Rectangle.prototype.Intersects = function(rectangle)
{
    var a = this;
    var b = rectangle;
    if (a.x < (b.x + b.width) && (a.x + a.width) > b.x && a.y < (b.y + b.height) && (a.y + a.height) > b.y)
    {
        return a.GetOffset(b);
    }
    else
    {
        return false;
    }
};
Torch.Rectangle.prototype.IntersectsTriangle = function(triangle)
{
    var that = this;
    var p1;
}
Torch.Rectangle.prototype.GetLines = function()
{
    var that = this;
}
Torch.Vector = function(x,y){
    this.x = x;
    this.y = y;
}
Torch.Vector.prototype.Normalize = function()
{
    var that = this;
    var r = (that.x * that.x) + (that.y * that.y);
    r = Math.sqrt(r);

    var x = that.x;
    var y = that.y;

    that.x = x / r;
    that.y = y / r;
};
Torch.Vector.prototype.GetDistance = function(otherVector)
{
    var that = this;
    var raw = Math.pow(otherVector.x - that.x, 2) + Math.pow(otherVector.y - that.y, 2);
    return Math.sqrt(raw);
}

Torch.Body = function()
{
    var Plane = function()
    {
        this.velocity = 0;
        this.acceleration = 0;
        this.lv = 0;
        this.la = 0;
        this.aTime = 0;
        this.maxVelocity = 100;
    }
    this.x = new Plane();
    this.y = new Plane();
}
Torch.HitBox = function()
{
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
}
