
var pixl = function(data, optionalColorPallette, optionalExportType)
{
    if (!data) throw "pixl error! 'data' argument is required";
    var colorPallette, //object that contains colors which correspond to data
        canvas, //html canvas element
        renderingCanvas, //canvas rendering context
        renderPixel, //function to draw each pixel
        renderRow, //function to draw a row of pixels
        render, //function that draws all the pixels
        findWidth, //function to find the max width of the data
        exportImage, //image data that is exported
        exportImageObject,
        exportType, //type of image (image/png, image/jpeg, image/gif, etc.)
        exportObject, //the returned object
        exportTime; //time to export

    var PIXEL_WIDTH = pixl.pixelSize == "default" ? 4 : pixl.pixelSize; //the dimensions of each drawn pixel
                                                                        //default is 4
    var EXPLODING = false;
    if (!optionalColorPallette || optionalColorPallette == "default")
    {
        colorPallette = { //default color pallette
            "1": "red",
            "2": "blue",
            "3": "yellow",
            "4": "green",
            "5": "violet",
            "6": "orange",
            "7": "pink",
            "8": "purple",
            "9": "black"
        }
    }
    else
    {
        colorPallette = optionalColorPallette
    }
    if (!optionalExportType || optionalExportType == "default")
    {
        exportType = "image/png"; //default image type
    }
    else
    {
        exportType = optionalExportType;
    }

    findWidth = function()
    {
        var max = 0;
        for (var i = 0; i < data.length; i++)
        {
            if (data[i].length > max) max = data[i].length;
        }
        return max;
    }
    renderPixel = function(pixel, drawPoint)
    {
        if (pixel == "." || pixel == "" || pixel == "*") return; //period means that nothing is there
        if (!colorPallette[pixel]) throw "pixl error! invalid pixel color: " + pixel;
        renderingCanvas.fillStyle = colorPallette[pixel]; //change the color
        renderingCanvas.fillRect(drawPoint.x, drawPoint.y, PIXEL_WIDTH, PIXEL_WIDTH); //draw the pixel
    }
    renderRow = function(pixelRow, y)
    {
        var drawPoint = {x: 0, y: y};
        var row;
        if (pixl.higherBits)
        {
            row = pixelRow.split("~");
        }
        else
        {
            row = pixelRow
        }
        for (var i = 0; i < row.length; i++)
        {
            renderPixel(row[i], drawPoint);
            if (row[i] != "*")
            {
                drawPoint.x += PIXEL_WIDTH;
            }
            else
            {
                drawPoint.x += 1;
                EXPLODING = true;
            }
        }
    }
    render = function()
    {
        var y = 0;
        var start = new Date().getTime(); //keep track of how long it takes

        for (var i = 0; i < data.length; i++)
        {
            renderRow(data[i], y);
            if (!EXPLODING) y += PIXEL_WIDTH;
            else y += 1;
        }

        exportImage = canvas.toDataURL(exportType); //export it

        var end = new Date().getTime();
        exportTime = end - start;
        console.log("pixl generation took: " + (exportTime / 1000).toString() + " seconds");
    }

    //get to it...
    canvas = document.createElement("CANVAS"); //create the canvas
    canvas.width = findWidth() * PIXEL_WIDTH; //set the dimensions
    canvas.height = data.length * PIXEL_WIDTH;
    renderingCanvas = canvas.getContext("2d"); //get that rendering context
    render();


    //export it
    exportObject = {
        src : exportImage,
        image: new Image(exportImage),
        time: exportTime,
    };

    return exportObject;
}
pixl.mode = "default"; //default, squares
pixl.pixelSize = "default"; //default(4), [integer]

pixl.HigherBits = function() //allow for more than 9-color pallette
{
    pixl.higherBits = true;
}
pixl.LowerBits = function()
{
    pixl.higherBits = false;
}



    //TODO
    //Add some operations that modify data (i.e explode, cut, fill, etc)

pixl.util = {};
pixl.util.DecomposeImage = function(image)
{
    var canvas = document.createElement("CANVAS");
    canvas.crossOrigin = "anonymous";
    var cnv;
    canvas.width = image.width;
    canvas.height = image.height;
    cnv = canvas.getContext("2d");
    cnv.drawImage(image, 0, 0);
    return canvas.toDataURL();
}
pixl.util.FillPixels = function(data, lineStart, lineEnd, pixel)
{
        var newData = [];
        var thisData = pixl.higherBits ? data.split("~") : data;
        var width = data[0].length;
        for (var i = 0; i < thisData.length; i++)
        {
            newData.push(data[i]);
            if (i == lineStart)
            {
                for (var j = 0; j < lineEnd; j++)
                {
                    var row = "";
                    for (var z = 0; z < width; z++)
                    {
                        if (pixl.higherBits)
                        {
                            row += pixl + "~";
                        }
                        else
                        {
                            row += pixel;
                        }
                    }
                    newData.push(row);
                }
            }

        }
        return newData;
}
pixl.util.ReplacePixels = function(data, pixelToReplace, newPixel)
{
    var newData = [];
    var thisData = pixl.higherBits ? data.split("~") : data;
    var addOn = pixl.higherBits ? "~" : "";
    for (var i = 0; i < thisData.length; i++)
    {
        var row = "";
        for (var j = 0; j < thisData[i].length; j++)
        {
            if (thisData[i][j] == pixelToReplace)
            {
                row += newPixel + addOn;
            }
            else
            {
                row += thisData[i][j] + addOn;
            }
        }
        newData.push(row);
    }
    return newData;
}
pixl.util.SpacePixels = function(data, pixelSpacer)
{
    var newData = [];
    var thisData = pixl.higherBits ? data.split("~") : data;
    var width = thisData[0].length * 2;
    var spaceRow = "";
    for (var z = 0; z < width; z++)
    {
        if (pixl.higherBits)
        {
            spaceRow += pixelSpacer + "~";
        }
        else
        {
            spaceRow += pixelSpacer;
        }
    }
    for (var i = 0; i < thisData.length; i++)
    {
        var row = "";
        for (var j = 0; j < thisData[i].length; j++)
        {
            if (j + 1 == thisData[i].length) break;
            if (pixl.higherBits)
            {
                row += thisData[i][j] + "~" + pixelSpacer + "~";
            }
            else
            {
                row += thisData[i][j] + pixelSpacer;
            }
        }
        newData.push(row);
        if (i + 1 != thisData.length)
        {
            newData.push(spaceRow);
        }
    }
    return newData;
}
pixl.util.ExplodePixels = function(data, depth)
{
    var newData = data;
    for (var i = 0; i < depth; i++)
    {
        newData = pixl.util.SpacePixels(newData, "*");
    }
    return newData;
}
pixl.util.VerticalMerge = function(data1, data2)
{
    var newData = data1.concat(data2);
    return newData;
}
pixl.util.HorizontalMerge = function(data1, data2)
{
    var newData = [];
    var thisData, otherData;
    if (data1.length > data2.length)
    {
        thisData = data1;
        otherData = data2;
    }
    else {
        thisData = data2;
        otherData = data1;
    }
    for (var i = 0; i < thisData.length; i++)
    {
        var addString = thisData[i];
        if (otherData[i]) addString += otherData[i];
        newData.push(addString);
    }
    return newData;
}
pixl.util.Blend = function(bottom, top, keepBottom) //does not support higher bits! bottom must be larger or equal to top
{
    var newData = [];
    for (var i = 0; i < bottom.length; i++)
    {
        var addString = "";
        for (var j = 0; j < bottom[i].length; j++)
        {
            var bPix = bottom[i][j];
            if (!top[i] || !top[i][j])
            {
                addString += bPix;
            }
            else if (top[i][j] && top[i][j] != "." && !keepBottom)
            {
                addString += top[i][j];
            }
            else
            {
                if (bPix == "." && top[i] && top[i][j] && top[i][j] != ".")
                {
                    addString += top[i][j];
                }
                else
                {
                    addString += bPix;
                }
            }

        }
        newData.push(addString);
    }
    return newData;
}
pixl.util.Mix = function(pal1, pal2)
{

}

//TODO
//Add some default pallettes
pixl.pal = {};

//TODO
//Add text stuff
//canvas.fillText is incredibly slow, faster to convert it to an image
pixl.Text = function(text)
{
    this.text = text;
    this.font = "arcade";
    this.fontSize = 30;
    this.color = "red";
    this.DrawText = null;
    this.ChangeText(text);
};
pixl.Text.prototype.Font = function (font)
{
    var that = this;
    that.font = font;
    that.ChangeText(that.text);
};
pixl.Text.prototype.ChangeText = function(text)
{
    var that = this;
    var canvas,
        renderingCanvas,
        exportImage;
    that.text = text;
    canvas = document.createElement("CANVAS");
    canvas.width = text.length * (that.fontSize / 2);
    canvas.height = 100;
    renderingCanvas = canvas.getContext("2d");
    renderingCanvas.fillStyle = that.color;
    renderingCanvas.font = that.fontSize + "px " + that.font//"30px Arial";
    renderingCanvas.fillText(text,0,that.fontSize);
    exportImage = new Image();
    exportImage.src = canvas.toDataURL();


    that.DrawText = exportImage;


}
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

        that.activeGame.deltaTime = timestamp - that.activeGame.time;

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
    //classes
    Rectangle: (function(){
        var Rectangle = function(x, y, width, height){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        };
        var proto = Rectangle.prototype;
        proto.GetOffset = function(rectangle)
        {
            var that = this;
            var vx = ( that.x + ( that.width / 2 ) ) - ( rectangle.x + ( rectangle.width / 2 ) );
            var vy = ( that.y + (that.height / 2 ) ) - ( rectangle.y + ( rectangle.height / 2 ) );
            var halfWidths = (that.width / 2) + (rectangle.width / 2);
            var halfHeights = (that.height / 2) + (rectangle.height / 2);

            return {
                x: halfWidths - Math.abs(vx),
                y: halfHeights - Math.abs(vy),
                vx: vx,
                vy: vy,
                halfWidths: halfWidths,
                halfHeights: halfHeights
            };
        }
        proto.Intersects = function(rectangle)
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

        return Rectangle;

    })(),

    Vector: (function(){
        var Vector = function(x,y){
            this.x = x;
            this.y = y;
        }
        var proto = Vector.prototype;
        proto.Normalize = function(){
            var that = this;
            var r = (that.x * that.x) + (that.y * that.y);
            r = Math.sqrt(r);

            var x = that.x;
            var y = that.y;

            that.x = x / r;
            that.y = y / r;
        };
        proto.GetDistance = function(otherVector){
            var that = this;
            var raw = Math.pow(otherVector.x - that.x, 2) + Math.pow(otherVector.y - that.y, 2);
            return Math.sqrt(raw);
        }

        return Vector;
    })()
};
Torch.Game = function(canvasId, width, height, name){
    console.log("%c   Torch-v-0.0.1   ", "background-color:#cc5200; color:white");
    this.canvasId = canvasId;
    this.canvasNode = document.getElementById(canvasId);
    this.canvas = this.canvasNode.getContext("2d");

    this.width = width;
    this.height = height;
    this.name = name;

    this.Load = new Torch.Load(this);

    this.Clear("#cc5200");

    this.Viewport = this.MakeViewport();

    this.deltaTime = 0;
    this.fps = 0;
    this.zoom = 1;
    this.gameHasRunSuccessfully = false;
    this.gameFailedToRun = false;
    this.paused = false;
    this.time = null;
    this.LastTimeStamp = null;
    this.spriteList = new Array();
    this.textList = new Array();
    this.animations = new Array();
    this.DrawStack = new Array();
    this.AddStack = new Array();
    this.Text = new Object();
    this.Lags = 0;
    this.NoLags = 0;
    this.LagTime = 0;
    this.uidCounter = 0;
};
Torch.Game.prototype.PixelScale = function()
{
    var that = this;
    that.canvas.webkitImageSmoothingEnabled = false;
    that.canvas.mozImageSmoothingEnabled = false;
    that.canvas.imageSmoothingEnabled = false; /// future
};
Torch.Game.prototype.Start = function(load, update, draw, init)
{
    var that = this;
    this.load = load;
    this.update = update;
    this.draw = draw;
    this.init = init;

    that.canvasNode.width = that.width;
    that.canvasNode.height = that.height;

    that.load();

    that.Load.Load(function()
    {
        try {
            that.init();
            that.WireUpEvents();
            Torch.activeGame = that;
            Torch.Run(that);
        } catch (e) {
            that.FatalError(e);
        }

    });
};
Torch.Game.prototype.Add = function(o)
{
    var that = this;
    if (!o._torch_add){
        Torch.Error("Invalid object added to game. object:");
        console.log(o);
    }

    switch (o._torch_add)
    {
        case "Sprite":
            o.game = that;
            that.AddStack.push(o);
            o._torch_uid = "TORCHSPRITE" + that.uidCounter.toString();
            that.uidCounter++;
        break;
        default:
            alert("error");
            break;
    }
};
Torch.Game.prototype.RunGame = function(timestamp)
{
    var that = this;
    that.canvas.clearRect(0, 0, that.Viewport.width, that.Viewport.height);

    that.draw();
    that.update();
    that.Viewport.Update();
    that.UpdateAndDrawSprites();

    if (that.debug) that.debug();

    that.fps = (1000 / that.deltaTime);

    for (var i = 0; i < that.animations.length; i++)
    {
        var anim = that.animations[i];
        anim.Run();
    }
    that.GamePads = [];
    var pads = navigator.getGamepads();
    for (var i = 0; i < pads.length; i++)
    {
        var pd = pads[i];
        if (pd)
        {
            that.GamePads.push(new Torch.GamePad(pd));
        }
    }

    Torch.Loop(timestamp);
};
Torch.Game.prototype.Run = function(timestamp)
{
    var that = this;
    if (!that.gameHasRunSuccessfully && !that.gameFailedToRun)
    {
        try
        {
            that.RunGame(timestamp);
            that.gameHasRunSuccessfully = true;

        }
        catch (e)
        {
            console.trace();
            Torch.Error("Game Has Failed To Run!");
            Torch.Error(e);
            that.gameFailedToRun = true;
            that.FatalError(e);
        }
    }
    if (that.gameHasRunSuccessfully)
    {
        that.RunGame(timestamp);
    }

};
Torch.Game.prototype.FatalError = function(error)
{
    var that = this;
    that.canvas.clearRect(0, 0, that.Viewport.width, that.Viewport.height);
    that.canvasNode.style.backgroundColor = "black";
    that.canvas.fillStyle = "red";
    that.canvas.font = "bold 16px Consolas";
    that.canvas.fillText("Fatal Error!", 40, 40);

    that.canvas.font = "16px Consolas";
    var split = error.stack.split("\n");
    for (var i = 0; i < split.length; i++)
    {
        that.canvas.fillText(error.stack.split("\n")[i], 40, 100 + (20 * i));
    }
    if (typeof(Torch) == "string")
    {
        that.canvas.clearRect(0,0,1000,1000);
        that.canvas.fillText(Torch, 40, 100);
    }
    console.trace();

};
Torch.Game.prototype.UpdateAndDrawSprites = function()
{
    var that = this;
    if (that.loading) return;
    var drawList = [];
    drawList = drawList.concat(that.spriteList);
    var cleanedDrawList = [];
    drawList.sort(function(a, b){
        return a.drawIndex - b.drawIndex;
    });
    for (var j = 0; j < drawList.length; j++)
    {
        var sprite = drawList[j];
        if (sprite.draw && !sprite.trash)
        {
            sprite.Draw();
        }
    }
    for (var i = 0; i < drawList.length; i++)
    {
        var sprite = drawList[i];
        if (!sprite.trash)
        {
            if (!sprite.game.paused)sprite.Update();
            cleanedDrawList.push(sprite);
        }
        else
        {
            if (sprite.OnTrash) sprite.OnTrash();
        }
    }

    that.spriteList = cleanedDrawList;

    for (var i = 0; i < that.AddStack.length; i++)
    {
        var o = that.AddStack[i];
        that.spriteList.push(o);
    }

    that.AddStack = new Array();
};
Torch.Game.prototype.Zoom = function(speed)
{
    var that = this;
    that.zoom += that.deltaTime * speed;
    that.canvasNode.style.zoom = that.zoom;
}
Torch.Game.prototype.Draw = function(texture, rectangle, params)
{
    var that = this;

    viewRect = that.Viewport.GetViewRectangle(that);

    if (!rectangle.Intersects(viewRect)) return;
    if (!params) params = {};

    that.canvas.save();

    var x = Math.round(rectangle.x + that.Viewport.x);
    var y = Math.round(rectangle.y + that.Viewport.y);
    var width = rectangle.width;
    var height = rectangle.height;

    var rotation = params.rotation ? params.rotation + that.Viewport.rotation: that.Viewport.rotation;

    that.canvas.globalAlpha = params.alpha ? params.alpha : that.canvas.globalAlpha;

    that.canvas.translate(x + width / 2, y + height / 2);

    that.canvas.rotate(rotation);

    if (params.IsTextureSheet)
    {
        if (params.tint)
        {
            that.DrawTint(texture.image, -width/2, -height/2, rectangle.width, rectangle.height, params.tint, params.tintLevel, params.clipX, params.clipY, params.clipWidth, params.clipHeight);
        }
        else
        {
            that.canvas.drawImage(texture.image, params.clipX, params.clipY, params.clipWidth, params.clipHeight, -width/2, -height/2, rectangle.width, rectangle.height);
        }
    }
    else
    {
        if (params.tint)
        {
            that.DrawTint(texture.image, -width/2, -height/2, rectangle.width, rectangle.height, params.tint, params.tintLevel)
        }
        else
        {
            that.canvas.drawImage(texture.image, -width/2, -height/2, rectangle.width, rectangle.height);
        }
    }

    that.canvas.rotate(0);
    that.canvas.globalAlpha = 1;

    that.canvas.restore();
};
Torch.Game.prototype.DrawTint = function(texture, x, y, width, height, spriteTint, spriteTintLevel, clipX, clipY, clipWidth, clipHeight)
{
    //do all transformations (rotate, translate, etc) before Drawing
    var that = this;
    var buffer = document.createElement("canvas");
    var renderBuffer;
    var tintLevel = spriteTintLevel ? spriteTintLevel : 0.5;

    buffer.width = width;
    buffer.height = height;

    renderBuffer = buffer.getContext("2d");
    renderBuffer.fillStyle = spriteTint;

    if (clipX)
    {
        renderBuffer.fillRect(0,0,buffer.width,buffer.height);
        renderBuffer.globalCompositeOperation = "destination-atop";
        renderBuffer.drawImage(texture,clipX,clipY,clipWidth,clipHeight,0,0,width,height);

        that.canvas.drawImage(texture,clipX,clipY,clipWidth,clipHeight,x,y,width,height);
        that.canvas.globalAlpha = tintLevel;
        that.canvas.drawImage(buffer, x, y);
    }
    else
    {
        renderBuffer.fillRect(0,0,buffer.width,buffer.height);
        renderBuffer.globalCompositeOperation = "destination-atop";
        renderBuffer.drawImage(texture,0,0);

        that.canvas.drawImage(texture,x,y);
        that.canvas.globalAlpha = tintLevel;
        that.canvas.drawImage(buffer, x, y);
    }


}
Torch.Game.prototype.Clear = function(color)
{
    var that = this;
    that.canvasNode.style.backgroundColor = color;
}
Torch.Game.prototype.getCanvasEvents = function()
{
    var that = this;
    var evts = [
        [
            "mousemove", function(e){
                that.Mouse.SetMousePos(that.canvasNode, e, that);
            }
        ],
        [
            "mousedown", function(){
                that.Mouse.down = true;
            }
        ],
        [
            "mouseup", function(){
                that.Mouse.down = false;
            }
        ],
        [
            "touchstart", function(){
                that.Mouse.down = true;
            }
        ],
        [
            "touchend", function(){
                that.Mouse.down = false;
            }
        ],
        [
            "click", function(e){
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        ]
    ];

    return evts;
}
Torch.Game.prototype.WireUpEvents = function()
{
    var that = this;
    var bodyEvents =
    [
        [
            "keydown", function(e){
                switch (e.keyCode)
                {
                    case 32:
                        that.Keys.Space.down = true;
                        break;
                    case 37:
                        that.Keys.LeftArrow.down = true;
                        break;
                    case 38:
                        that.Keys.UpArrow.down = true;
                        break;
                    case 39:
                        that.Keys.RightArrow.down = true;
                        break;
                    case 40:
                        that.Keys.DownArrow.down = true;
                        break;
                    default:
                        that.Keys[String.fromCharCode(e.keyCode).toUpperCase()].down = true;
                        break;
                }

            }
        ],
        [
            "keyup", function(e){
                switch (e.keyCode)
                {
                    case 32:
                        that.Keys.Space.down = false;
                        break;
                    case 37:
                        that.Keys.LeftArrow.down = false;
                        break;
                    case 38:
                        that.Keys.UpArrow.down = false;
                        break;
                    case 39:
                        that.Keys.RightArrow.down = false;
                        break;
                    case 40:
                        that.Keys.DownArrow.down = false;
                        break;
                    default:
                        that.Keys[String.fromCharCode(e.keyCode).toUpperCase()].down = false;
                        break;
                }
            }
        ]
    ];
    $(that.getCanvasEvents()).each(function(){
        var eventItem = $(this);
        that.canvasNode.addEventListener(eventItem[0], eventItem[1], false);
    });

    $(bodyEvents).each(function(){
        var eventItem = $(this);
        document.body.addEventListener(eventItem[0], eventItem[1], false);
    });
    window.addEventListener("gamepadconnected", function(e) {
        var gp = navigator.getGamepads()[e.gamepad.index];
        that.GamePads.push(new Torch.GamePad(gp));
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
    });
    var pads = navigator.getGamepads();
    for (var i = 0; i < pads.length; i++)
    {
        //that.GamePads.push(new Torch.GamePad(pads[i]));
    }
};
Torch.Game.prototype.Keys = (function(){
    var _keys = [];
    for (i = 0; i < 230; i++)
    {
        var _char = String.fromCharCode(i).toUpperCase();
        switch (i)
        {
            case 37:
            _keys["LeftArrow"] = {down:false};
            break;

            case 38:
            _keys["UpArrow"] = {down:false};
            break;

            case 39:
            _keys["RightArrow"] = {down:false};
            break;

            case 40:
            _keys["DownArrow"] = {down:false};

            default:
            _keys[_char] = {down:false};
            break;
        }


    }
    _keys["Space"] = {down:false};
    return _keys;
})();
Torch.Game.prototype.MakeViewport = function(){
    var that = this;
    var Viewport = {
        x: 0,
        y: 0,
        width: 1280,
        height: 720,
        maxWidth: $("body").width(),
        maxHeight: $("body").height(),
        rotation: 0,

        Update: function()
        {
            var that = this;
            if (that.followSprite)
            {
                that.x = that.followSprite.origX - that.followSprite.Rectangle.x;
                that.y = that.followSprite.origY - that.followSprite.Rectangle.y;
            }
        },

        Maximize: function(){
            var that = this;
            var canvasElement = that.game.canvasNode;
            $(canvasElement).attr("width",that.game.Viewport.maxWidth);

            $(canvasElement).attr("height", that.game.Viewport.maxWidth * 0.5);

            that.width = that.game.Viewport.maxWidth;
            that.height = that.game.Viewport.maxWidth * 0.5;
        },

        GetViewRectangle: function(game)
        {
            var that = this.game//game;
             return new Torch.Rectangle(-that.Viewport.x, -that.Viewport.y, that.Viewport.width, that.Viewport.height);
        },

        Follow: function(sprite)
        {
            this.followSprite = sprite;
            sprite.origX = sprite.Rectangle.x;
            sprite.origY = sprite.Rectangle.y;
        },

        Center: function(sprite)
        {
        //    this.x = sprite.Rectangle.x + (this.width / 8);
        },

        Latch: function(sprite)
        {
            this.x = (1280 / 2) + ( 0 - sprite.Rectangle.x );
        }
    };
    Viewport.game = that;
    return Viewport;
};

Torch.Game.prototype.Mouse = {
    x: 0,
    y: 0,
    down: false,
    SetMousePos: function(c, evt, game)
    {
        var rect = c.getBoundingClientRect();

        game.Mouse.x = evt.clientX - rect.left;
        game.Mouse.y = evt.clientY - rect.top;
    },
    GetRectangle: function(game)
    {
        return new Torch.Rectangle(game.Mouse.x - game.Viewport.x, game.Mouse.y - game.Viewport.y, 5, 5);
    }
};

Torch.Game.prototype.TogglePause = function()
{
    if (!this.paused) this.paused = true;
    else this.paused = false;
}
Torch.Load = function(game)
{
    this.game = game;
    this.game.Assets = {
        game: game,
        GetTexture: function(id)
        {
            return this.game.Assets.Textures[id];
        },
        GetTexturePack: function(id)
        {
            return this.game.Assets.TexturePacks[id];
        },
        GetTextureSheet: function(id)
        {
            return this.game.Assets.TextureSheets[id];
        },
        GetSound: function(id)
        {
            return this.game.Assets.Sounds[id].audio;
        }
    };
    this.textures = this.game.Assets.Textures = [];
    this.texturePacks = this.game.Assets.TexturePacks = [];
    this.textureSheets = this.game.Assets.TextureSheets = [];
    this.sound = this.game.Assets.Sounds = [];
    this.Stack = [];
    this.finish_stack = 0;
    this.loaded = false;
    this.loadLog = "";

};
Torch.Load.prototype.Sound = function(path, id)
{
    var that = this;
    if (that.sound[id])
    {
        Torch.Error("Asset ID '" + id + "' already exists");
    }
    that.Stack.push({
        _torch_asset: "sound",
        id: id,
        path: path
    });
    that.finish_stack++;
}
Torch.Load.prototype.Texture = function(path, id)
{
    var that = this;

    if (that.textures[id])
    {
        Torch.Error("Asset ID '" + id + "' already exists");
    }

    that.Stack.push({
        _torch_asset: "texture",
        id: id,
        path: path
    });
    that.finish_stack++;
};
Torch.Load.prototype.PixlTexture = function(pattern, pallette, id)
{
    var that = this;
    console.log(pattern);
    var imSrc = pixl(pattern, pallette).src;
    that.Stack.push({
        _torch_asset: "texture",
        id: id,
        path: imSrc
    });
};
Torch.Load.prototype.TexturePack = function(path, id, range, fileType)
{
    var that = this;
    var pack = [];
    for (var i = 1; i <= range; i++)
    {
        var packPath = path + "_" + i.toString() + "." + fileType;
        var packId = id + "_" + i.toString();

        that.Stack.push({
            _torch_asset: "texture",
            id: packId,
            path: packPath
        });

        pack.push(packId);

        that.finish_stack++;
    }
    that.texturePacks[id] = pack;
};
Torch.Load.prototype.TextureSheet = function(path, id, totalWidth, totalHeight, clipWidth, clipHeight)
{
    var that = this;
    var rows = totalHeight / clipHeight;
    var columns = totalWidth / clipWidth;
    var sheet = [];

    that.Stack.push({
        _torch_asset: "texture",
        id: id,
        path: path
    });

    for (var i = 0; i < columns; i++)
    {
        for (var j = 0; j < rows; j++)
        {
            var sheetClip = {
                clipX: i * clipWidth,
                clipY: j * clipHeight,
                clipWidth: clipWidth,
                clipHeight: clipHeight
            };
            sheet.push(sheetClip);
        }
    }
    that.textureSheets[id] = sheet;
};
//sound, sound pack ?
Torch.Load.prototype.Load = function(finishFunction)
{
    var that = this;
    for (var i = 0; i < that.Stack.length; i++)
    {
        switch(that.Stack[i]._torch_asset)
        {
            case "texture":
                var im = new Image();
                im.src = that.Stack[i].path;

                that.Stack[i].image = im;

                that.textures[that.Stack[i].id] = that.Stack[i];

                im.refId = that.Stack[i].id;

                im.onload = function()
                {
                    that.textures[this.refId].width = this.width;
                    that.textures[this.refId].height = this.height;
                    that.finish_stack--;
                    //Torch.Message("Loaded Image:" + this.src, "yellow");
                }
            break;
            case "sound":
                var aud = new Audio();
                aud.src = that.Stack[i].path;
                that.Stack[i].audio = aud;
                that.sound[that.Stack[i].id] = that.Stack[i];
                that.finish_stack--;
                aud.toggle = function(){
                    var that = this;
                    that.currentTime = 0;
                    that.play();
                }
                //Torch.Message("Loaded Sound:" + aud.src, "yellow");
            break;
        }

    }
    var TIME_TO_LOAD = 0;
    _l = setInterval(function()
    {
        TIME_TO_LOAD++
        if (that.finish_stack <= 0)
        {
            finishFunction();
            clearInterval(_l);
            Torch.Message("Finished Loading in: " + ( TIME_TO_LOAD * (1000/60) / 1000) + " seconds", "green" );
        }
    }, 1000/60);
}
Torch.Animation = function(game)
{
	this.game = game;
};
Torch.Animation.prototype.Run = function()
{
	var that = this;
	if (that.animating)
	{
		that.Update();
		//that.boundObject.DrawTexture = that.GetCurrentFrame();
	}
	if (that.Kill && that.hasRun)
	{
		that.Stop();
	}
	if (that.hasRun && (that.KillOnFirstRun || that.Kill))
	{
		that.Stop();
		var cleanedAnims = [];
		for (var i = 0; i < Torch.animations.length; i++)
		{
			if (i == that.animationPosition)
			{

			}
			else
			{
				cleanedAnims.push(Torch.Animation.animations[i]);
			}
		}
		Torch.animations = cleanedAnims;
	}
};
Torch.Animation.prototype.Start = function()
{
	var that = this;
	that.animating = true;
}
Torch.Animation.prototype.Stop = function()
{
	var that = this;
	that.animating = false;
};
Torch.Animation.prototype.Single = function()
{
	var that = this;
	this.KillOnFirstRun = true;
	this.animating = true;
};
Torch.Animation.prototype.Reset = function()
{
	var that = this;
	that.elapsedTime = 0;
	that.textureListIndex = 0;
	this.hasRun = false;
};
/*
		Torch.Animation.TexturePack
*/
Torch.Animation.TexturePack = function(texturePack, game)
{
	this.step = 50;
	this.maxIndex = texturePack.length - 1;
	this.textureIndex = 0;
	this.texturePack = texturePack;
	this.game = game;
	this.elapsedTime = 0;
	game.animations.push(this);
}
Torch.Animation.TexturePack.is(Torch.Animation);
Torch.Animation.TexturePack.prototype.Update = function()
{
	var that = this;
	that.elapsedTime += game.deltaTime;

	if (that.elapsedTime >= that.step)
	{
		that.elapsedTime = 0;
		that.textureIndex++;
	}
	if (that.textureIndex > that.maxIndex)
	{
		if (!that.Kill) that.textureIndex = 0;
		if (that.Kill) that.textureIndex = -1;
		that.hasRun = true;
	}
}
Torch.Animation.TexturePack.prototype.GetCurrentFrame = function()
{
	var that = this;
	return game.Assets.Textures[that.texturePack[that.textureIndex]];
};
/*
	Torch.Animation.TextureSheet
*/
Torch.Animation.TextureSheet = function(TextureSheet, game)
{
	this.step = 50;
	this.maxIndex = TextureSheet.length - 1;
	this.textureIndex = 0;
	this.TextureSheet = TextureSheet;
	this.game = game;
	this.elapsedTime = 0;
	this.delay = 0;
	this.delayCount = 0;
	game.animations.push(this);
};
Torch.Animation.TextureSheet.is(Torch.Animation);
Torch.Animation.TextureSheet.prototype.Update = function()
{
	var that = this;
	that.elapsedTime += that.game.deltaTime;

	if (that.elapsedTime >= that.step && ! (that.hasRun && that.Kill) )
	{
		that.elapsedTime = 0;
		that.textureIndex++;
	}
	if (that.textureIndex >= that.maxIndex && that.delayCount <= 0)
	{
		if (!that.Kill) that.textureIndex = 0;
		//if (that.Kill) that.textureIndex = that.TextureSheet.length - 1;
		//that.TextureSheet = null;
		that.hasRun = true;
		if (that.finishCallBack) that.finishCallBack();
		that.delayCount = that.delay;
	}
	else if (that.textureIndex >= that.maxIndex)
	{
		that.delayCount -= Game.deltaTime;
		that.textureIndex--;
	}
};
Torch.Animation.TextureSheet.prototype.GetCurrentFrame = function()
{
	var that = this;
	if (that.TextureSheet)
	{
		return that.TextureSheet[that.textureIndex];
	}
};
/*
        Torch.Bind
*/
Torch.Bind = function(sprite)
{
    this.sprite = sprite;
}
Torch.Bind.prototype.Reset = function()
{
    var that = this;
    var sprite = that.sprite;

    if (sprite.TextureSheetAnimation)
    {
        that.sprite.TextureSheetAnimation.Stop();
        that.sprite.anim = null;
        that.sprite.TextureSheet = null;
    }
    if (sprite.TexturePackAnimation)
    {
        that.sprite.TexturePackAnimation.Stop();
        that.sprite.anim = null;
        that.sprite.TexturePack = null;
    }

}
Torch.Bind.prototype.Texture = function(textureId, optionalParameters)
{
    var that = this;
    var tex = that.sprite.game.Assets.Textures[textureId];
    var scale = 1;

    that.Reset();

    if (Torch.Scale)
    {
        scale = Torch.Scale;
    }
    that.sprite.DrawTexture = tex;

    that.sprite.Rectangle.width = tex.width * scale;
    that.sprite.Rectangle.height = tex.height * scale;
};
Torch.Bind.prototype.TexturePack = function(texturePackId, optionalParameters)
{
    var that = this;

    if (!optionalParameters) optionalParameters = {};

    that.sprite.TexturePack = that.sprite.game.Assets.TexturePacks[texturePackId];
    var anim = new Torch.Animation.TexturePack(that.sprite.TexturePack, that.sprite.game);

    if (optionalParameters.step) anim.step = optionalParameters.step;

    anim.Start();
    that.sprite.TexturePackAnimation = anim;
    that.sprite.Rectangle.width = anim.GetCurrentFrame().width;
    that.sprite.Rectangle.height = anim.GetCurrentFrame().height;
};
Torch.Bind.prototype.TextureSheet = function(textureSheetId, optionalParameters)
{
    var that = this;
    if (!optionalParameters) optionalParameters = {};
    that.sprite.TextureSheet = that.sprite.game.Assets.TextureSheets[textureSheetId];
    that.sprite.DrawTexture = that.sprite.game.Assets.Textures[textureSheetId];

    var anim = new Torch.Animation.TextureSheet(that.sprite.TextureSheet, that.sprite.game);
    anim.sprite = that.sprite;
    if (optionalParameters.delay)
    {
        anim.delay = optionalParameters.delay;
        anim.delayCount = anim.delay;
    }
    if (optionalParameters.step) anim.step = optionalParameters.step;

    anim.Start();
    that.sprite.TextureSheetAnimation = anim;

    that.sprite.Rectangle.width = anim.GetCurrentFrame().clipWidth;
    that.sprite.Rectangle.height = anim.GetCurrentFrame().clipHeight;
}
Torch.Bind.prototype.PixlTexture = function(pixlData, colorPallette)
{
    var that = this;
    var tex = pixl(pixlData, colorPallette);
    var im = new Image();

    that.Reset();
    im.src = tex.src;
    im.onload = function()
    {
        var scale = 1;
        if (Torch.Scale) scale = Torch.Scale;
        that.sprite.Rectangle.width = im.width * scale;
        that.sprite.Rectangle.height = im.height * scale;
        that.sprite.DrawTexture = tex;
    }


}
/*
        Torch.Sprite
*/
Torch.Sprite = function(x,y)
{
    this.InitSprite(x,y)
};
Torch.Sprite.prototype.InitSprite = function(x,y)
{
    if (x == null || x == undefined) Torch.Error("argument 'x' is required");
    if (y == null || y == undefined) Torch.Error("argument 'y' is required");
    this.Bind = new Torch.Bind(this);
    this.Rectangle = new Torch.Rectangle(x, y, 0, 0);
    this.BoundingBox = new Torch.Rectangle(x, y, 0, 0);
    this.Body = {
        x: {
            velocity: 0,
            acceleration: 0,
            lv: 0,
            la: 0,
            aTime: 0,
            maxVelocity: 100
        },
        y: {
            velocity: 0,
            acceleration: 0,
            lv: 0,
            la: 0,
            aTime: 0,
            maxVelocity: 100
        }
    }
    this.game = null;
    this.DrawTexture = null;
    this.TexturePack = null;
    this.TextureSheet = null;
    this.onClick = null;
    this.onClickAway = null;
    this.onMouseOver = null;
    this.onMouseLeave = null;
    this.onMoveFinish = null;
    this.mouseOver = false;
    this.clickTrigger = false;
    this.clickAwayTrigger = false;
    this.trash = false;
    this.DrawParams = {};
    this.drawIndex = 0;
    this._torch_add = "Sprite";
    this._torch_uid = "";
    this.fixed = false;
    this.draw = true;
    this.wasClicked = false;
}
Torch.Sprite.prototype.GetBoundingBox = function()
{
    var that = this;
    var bound = 1;
    var boundingBox = new Torch.Rectangle(that.Rectangle.x + bound, that.Rectangle.y + bound, that.Rectangle.width - bound,that.Rectangle.height - bound);
    return boundingBox;
};
Torch.Sprite.prototype.UpdateBody = function()
{
    var that = this;
    var velX = that.Body.x.velocity;
    var velY = that.Body.y.velocity;
    if (that.Body.x.acceleration != that.Body.x.la)
    {
        that.Body.x.la = that.Body.x.acceleration;
        that.Body.x.aTime = 0;
    }
    if (that.Body.x.acceleration != 0)
    {
        that.Body.x.aTime += that.game.deltaTime;
        velX += that.Body.x.aTime * that.Body.x.acceleration;
    }
    if (that.Body.y.acceleration != that.Body.y.la)
    {
        that.Body.y.la = that.Body.y.acceleration;
        that.Body.y.aTime = 0;
    }
    if (that.Body.y.acceleration != 0)
    {
        that.Body.y.aTime += that.game.deltaTime;
        velY += that.Body.y.aTime * that.Body.y.acceleration;
    }
    if (Math.abs(velX) < Math.abs(that.Body.x.maxVelocity))
    {
        that.Rectangle.x += velX * that.game.deltaTime;
    }
    else
    {
        var dir = velX < 0 ? -1 : 1;
        that.Rectangle.x += dir * that.Body.x.maxVelocity * that.game.deltaTime;
    }
    that.Rectangle.y += velY * that.game.deltaTime;
};

Torch.Sprite.prototype.ToggleFixed = function()
{
    var that = this;
    if (that.fixed) that.fixed = false;
    else that.fixed = true;
}
Torch.Sprite.prototype.BaseUpdate = function()
{
    var that = this;
    that.UpdateBody();
    that.UpdateEvents();
}
Torch.Sprite.prototype.Update = function()
{
    var that = this
    that.BaseUpdate();
}
Torch.Sprite.prototype.Draw = function()
{
    var that = this;
    var DrawRec = new Torch.Rectangle(that.Rectangle.x, that.Rectangle.y, that.Rectangle.width, that.Rectangle.height);
    if (that.fixed)
    {
        DrawRec.x -= that.game.Viewport.x;
        DrawRec.y -= that.game.Viewport.y;
    }
    if (that.TexturePack)
    {
        that.game.Draw(that.TexturePackAnimation.GetCurrentFrame(), DrawRec, that.DrawParams);
    }
    else if (that.TextureSheet)
    {
        var Params = that.DrawParams ? Object.create(that.DrawParams) : {};
        var frame = that.TextureSheetAnimation.GetCurrentFrame();
        Params.clipX = frame.clipX;
        Params.clipY = frame.clipY;
        Params.clipWidth = frame.clipWidth;
        Params.clipHeight = frame.clipHeight;
        Params.IsTextureSheet = true;
        that.game.Draw(that.DrawTexture, DrawRec, Params);
    }
    else
    {
        that.game.Draw(that.DrawTexture, DrawRec, that.DrawParams);
    }
}
Torch.Sprite.prototype.UpdateEvents = function()
{
    var that = this;
    if (this.game.Mouse.GetRectangle(this.game).Intersects(that.Rectangle))
    {
        if (that.onMouseOver && !that.mouseOver) that.onMouseOver(that);
        that.mouseOver = true;
    }
    else if (that.fixed)
    {
        var mouseRec = that.game.Mouse.GetRectangle(that.game);
        var reComputedMouseRec = new Torch.Rectangle(mouseRec.x, mouseRec.y, mouseRec.width, mouseRec.height);
        reComputedMouseRec.x += that.game.Viewport.x;
        reComputedMouseRec.y += that.game.Viewport.y;
        if (reComputedMouseRec.Intersects(that.Rectangle))
        {
            that.mouseOver = true;
        }
        else
        {
            that.mouseOver = false;
        }
    }
    else
    {
        that.mouseOver = false;
    }

    if (that.mouseOver && that.game.Mouse.down && ! that.clickTrigger)
    {
        that.clickTrigger = true;
    }

    if (that.clickTrigger && !that.game.Mouse.down && that.mouseOver)
    {
        that.wasClicked = true;
        if (that.onClick)
        {
            that.onClick(that);

        }
        that.clickTrigger = false;
    }
    if (that.clickTrigger && !that.game.Mouse.down && !that.mouseOver)
    {
        that.clickTrigger = false;
    }

    if (!that.game.Mouse.down && !that.mouseOver && that.clickAwayTrigger)
    {
        if (that.onClickAway)
        {
            that.onClickAway();
            that.wasClicked = false;
            that.clickAwayTrigger = false;
        }
    }
    else if (that.clickTrigger && !that.game.Mouse.down && that.mouseOver)
    {
        that.clickAwayTrigger = false;
    }
    else if (that.game.Mouse.down && !that.mouseOver)
    {
        that.clickAwayTrigger = true;
    }
}
Torch.Sprite.prototype.Click = function(eventFunction)
{
    var that = this;
    that.onClick = eventFunction;
};
Torch.Sprite.prototype.ClickAway = function(eventFunction)
{
    var that = this;
    that.onClickAway = eventFunction;
}
Torch.Sprite.prototype.MouseOver = function(eventFunction)
{
    var that = this;
    that.onMouseOver = eventFunction;
}
Torch.Sprite.prototype.MouseLeave = function(eventFunction)
{
    var that = this;
    that.onMouseLeave = eventFunction;
}
Torch.Sprite.prototype.OnceEffect = function()
{
    var that = this;
    that.TextureSheetAnimation.Kill = true;
}
Torch.Sprite.prototype.Once = function()
{
    var that = this;
    that.once = true;
}
Torch.Sprite.prototype.Hide = function()
{
    this.draw = false;
}
Torch.Sprite.prototype.Show = function()
{
    this.draw = true;
}
Torch.Sprite.prototype.Trash = function()
{
    this.trash = true;
}
Torch.Sprite.prototype.NotSelf = function(otherSprite)
{
    var that = this;
    return (otherSprite._torch_uid != that._torch_uid);
}
/*
        Torch.Text
*/

Torch.Text = function(textLayers, x, y, maxFontSize)
{
    var that = this;
    that._torch_add = "Sprite";
    that.maxFontSize = maxFontSize;
    that.textLayers = textLayers;
    that.InitSprite(x,y);
    that.DrawTexture = that.GetBitmap();
    that.Rectangle.width = that.DrawTexture.image.width;
    that.Rectangle.height = that.DrawTexture.image.height;
    that.drawIndex = 100;
};

Torch.Text.is(Torch.Sprite);

Torch.Text.prototype.ApplyLayer = function(layer, cnv)
{
    var that = this;
    if (layer.font) cnv.font = layer.font;
    if (layer.fillStyle) {
        cnv.fillStyle = layer.fillStyle;
        cnv.fillText(layer.text, 10, that.maxFontSize / 1.3);
    }
    if (layer.strokeStyle) {
        cnv.strokeStyle = layer.strokeStyle;
        cnv.strokeText(layer.text, 10, 10);
    }
}

Torch.Text.prototype.GetBitmap = function()
{
    var that = this;
    var cv = document.createElement("canvas");

    cv.width = that.textLayers[0].text.length * that.maxFontSize * 0.8;
    cv.height = that.maxFontSize;
    cnv = cv.getContext("2d");

    for (var i = 0; i < that.textLayers.length; i++)
    {
        if (that.textLayers[i].background)
        {
            cnv.fillStyle = that.textLayers[i].background;
            cnv.fillRect(0,0,cv.width,cv.height)
        }
        that.ApplyLayer(that.textLayers[i], cnv);
    }


    var image = new Image();
    image.src = cv.toDataURL();
    return {image: image};
}
Torch.Debug = function(game)
{
    var FrameRateThreshHold = 50;
    game.debug = function(){
        var performancePercent = game.NoLags / (game.NoLags + game.Lags);
        var performance = ""
        if (game.NoLags == 0 || (game.Lags == 0 && game.NoLags == 0))
        {
            performance = "100";
        }
        else
        {
            var performanceRaw = (performancePercent).toString().split(".")[1];
            performance = performanceRaw;
        }



        var infoString = "Debug Info For:" + game.name + "<br>";
            infoString += "fps:" + Game.fps + "<br>";
            infoString += "SpriteLoad:" + game.spriteList.length + "<br>";
            infoString += "Lags:" + game.Lags + "<br>";
            infoString += "NoLags:" + game.NoLags + "<br>";
            infoString += "Time:" + (game.time/1000).toString().split(".")[0] + "<br>";
            infoString += "Performance(Lags vs No Lags):" + performance;
        $("#info").html(infoString);

        if (game.fps < FrameRateThreshHold && game.fps != 0)
        {
            game.Lags++;
            game.LagTime += game.deltaTime;
        }
        else{
            game.NoLags++;
        }
        if ((game.Lags + game.NoLags) > 500)
        {
            game.Lags = 1;
            game.NoLags = 1;
        }

    };
}
Torch.Game.prototype.GamePads = [];

Torch.GamePad = function(nativeGamePad)
{
    var that = this;
    this.nativeGamePad = nativeGamePad;
    if (that.nativeGamePad)
    {
        that.A = {down: that.nativeGamePad.buttons[0].pressed};
        that.B = {down: that.nativeGamePad.buttons[1].pressed};
        that.X = {down: that.nativeGamePad.buttons[2].pressed};
        that.Y = {down: that.nativeGamePad.buttons[3].pressed};

        that.DPadLeft = {down: that.nativeGamePad.buttons[14].pressed};
        that.DPadRight = {down: that.nativeGamePad.buttons[15].pressed};
        that.DPadUp = {down: that.nativeGamePad.buttons[13].pressed};
        that.DPadDown = {down: that.nativeGamePad.buttons[12].pressed};

        that.Start = {down: that.nativeGamePad.buttons[9].pressed};
        that.Back = {down: that.nativeGamePad.buttons[8].pressed};

        that.LeftTrigger = {down: that.nativeGamePad.buttons[6].pressed};
        that.RightTrigger = {down: that.nativeGamePad.buttons[7].pressed};

        that.LeftBumper = {down: that.nativeGamePad.buttons[4].pressed};
        that.RightBumper = {down: that.nativeGamePad.buttons[5].pressed};

        that.RightStick = {down: that.nativeGamePad.buttons[11].pressed};
        that.LeftStick = {down: that.nativeGamePad.buttons[10].pressed};
    }
}
Torch.GamePad.prototype.Debug = function()
{
    var that = this;
    for (var i = 0; i < that.nativeGamePad.buttons.length; i++)
    {
        if (that.nativeGamePad.buttons[i].pressed)
        {
            console.log(that.nativeGamePad.buttons[i]);
            console.log("pressed");
        }
    }
}
Torch.GamePad.prototype.A = function()
{
    var that = this;
    return that.nativeGamePad.buttons[4];
}
Torch.SpriteGroup = function(sprites)
{
    this.sprites = sprites;
};
Torch.SpriteGroup.prototype.Shift = (transition)
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        if (transition.x) sprite.x += transition.x;
        if (transition.y) sprite.y += transition.y;
    }
}
