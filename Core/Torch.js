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
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

var Torch =
{
    activeGame: null,
    animations: [],
    Tween: {
        Linear: 0,
        Quadratic: 1,
        Cubic: 2,
        Inverse: 3,
        InverseSquare: 4,
        SquareRoot: 5
    },
    Run: function(Game){
        var that = this;
        window.requestAnimationFrame(function(timestamp)
        {
            that.activeGame.Run(timestamp, that.activeGame);
        });
    },
    Loop: function(timestamp){
        var that = this;
        if (!that.activeGame.time)
        {
            that.activeGame.time = timestamp
        }

        that.activeGame.deltaTime = Math.round(timestamp - that.activeGame.time);

        that.activeGame.time = timestamp;


        window.requestAnimationFrame(function(timestamp)
        {
            that.activeGame.Run(timestamp, that.activeGame);
        });
    },
    Error: function(message)
    {
        console.log("%c   " + "Torch Error! -->" + message, "background-color:#black; color:red");
        Torch.Message("Torch Error! -->" + message, "red");
        Torch.activeGame = null;
        Torch = message;
        throw message;
    },
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
    Reset: function()
    {
        var that = this;
        if (that.activeGame) that.activeGame.time = 0;
        //that.activeGame = null;
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
