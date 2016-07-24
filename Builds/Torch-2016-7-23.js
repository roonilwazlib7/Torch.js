
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
        image: new Image(exportImage),
        src : exportImage,
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
Torch.Game = function(canvasId, width, height, name){
    console.log("%c   " + Torch.version + "-" + name + "  ", "background-color:#cc5200; color:white");
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
    this.GamePads = new Array();
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

    that.canvasNode.width = typeof(that.width) == "string" ? document.body.clientWidth - 50 : that.width;
    that.canvasNode.height = typeof(that.height) == "string" ? document.body.clientHeight - 25 : that.height;
    that.Viewport.width = that.canvasNode.width;
    that.Viewport.height = that.canvasNode.height;

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
    Torch.Timer.Update();
    that.UpdateGamePads();
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
        if (sprite.draw && !sprite.trash && !sprite.GHOST_SPRITE)
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
            sprite.trashed = true;
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
Torch.Game.prototype.UpdateGamePads = function()
{
    var that = this;
    if ( navigator.getGamepads && typeof(navigator.getGamepads) )
    {
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
    }
}
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
        that.canvas.drawImage(buffer,clipX,clipY,clipWidth,clipHeight,x,y,width,height);
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
        if (that.finish_stack <= 0 && TIME_TO_LOAD > 10)
        {
            finishFunction();
            clearInterval(_l);
            Torch.Message("Finished Loading in: " + ( TIME_TO_LOAD * (1000/60) / 1000) + " seconds", "green" );
            
        }
    }, 1000/60);
}
Torch.Timer = {
    futureEvents: [],
    Update: function()
    {
        var that = this;
        for (var i = 0; i < that.futureEvents.length; i++)
        {
            that.futureEvents[i].Update();
        }
    },
    SetFutureEvent: function(time, handle)
    {
        this.futureEvents.push(new Torch.FutureEvent(time, handle));
    }
};
Torch.FutureEvent = function(timeToOccur, handle)
{
    var that = this;
    that.time = 0;
    that.timeToOccur = timeToOccur;
    that.handle = handle;
}
Torch.FutureEvent.prototype.Update = function()
{
    var that = this;
    that.time += Game.deltaTime;
    if (that.time >= that.timeToOccur)
    {
        if (that.handle) that.handle();
        that.handle = null;
    }
}
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
    var tex = typeof(textureId) == "string" ? that.sprite.game.Assets.Textures[textureId] : textureId;
    var scale = 1;

    that.Reset();

    if (Torch.Scale && !that.sprite.TEXT)
    {
        scale = Torch.Scale;
    }
    that.sprite.DrawTexture = typeof(textureId) == "string" ? tex : {image:textureId};

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

    that.sprite.Rectangle.width = anim.GetCurrentFrame().clipWidth * Torch.Scale;
    that.sprite.Rectangle.height = anim.GetCurrentFrame().clipHeight * Torch.Scale;
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
Torch.Sprite = function(game,x,y)
{
    this.InitSprite(game,x,y)
};
Torch.Sprite.prototype.InitSprite = function(game,x,y)
{
    if (x == null || x == undefined) Torch.Error("argument 'x' is required");
    if (y == null || y == undefined) Torch.Error("argument 'y' is required");
    this.Bind = new Torch.Bind(this);
    this.Rectangle = new Torch.Rectangle(x, y, 0, 0);
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
    this.game = game;
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
    this.rotation = 0;
    this.opacity = 1;
    game.Add(this);
}
Torch.Sprite.prototype.UpdateBody = function()
{
    var that = this;
    var velX = that.Body.x.velocity;
    var velY = that.Body.y.velocity;
    var deltaTime = that.game.deltaTime;
    if (that.Body.x.acceleration != that.Body.x.la)
    {
        that.Body.x.la = that.Body.x.acceleration;
        that.Body.x.aTime = 0;
    }
    if (that.Body.x.acceleration != 0)
    {
        that.Body.x.aTime += deltaTime;
        velX += that.Body.x.aTime * that.Body.x.acceleration;
    }
    if (that.Body.y.acceleration != that.Body.y.la)
    {
        that.Body.y.la = that.Body.y.acceleration;
        that.Body.y.aTime = 0;
    }
    if (that.Body.y.acceleration != 0)
    {
        that.Body.y.aTime += deltaTime;
        velY += that.Body.y.aTime * that.Body.y.acceleration;
    }
    if (Math.abs(velX) < Math.abs(that.Body.x.maxVelocity))
    {
        that.Rectangle.x += velX * deltaTime;
    }
    else
    {
        var dir = velX < 0 ? -1 : 1;
        that.Rectangle.x += dir * that.Body.x.maxVelocity * deltaTime;
    }
    that.Rectangle.y += velY * deltaTime;
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
        that.game.Draw(that.DrawTexture, DrawRec, DrawParams);
    }
}
Torch.Sprite.prototype.UpdateEvents = function()
{
    var that = this;
    if (!this.game.Mouse.GetRectangle(this.game).Intersects(that.Rectangle) && that.mouseOver)
    {
        that.mouseOver = false;
        if (that.onMouseLeave)that.onMouseLeave(that);
    }
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
};
Torch.Sprite.prototype.GetDirectionVector = function(otherSprite)
{
    var that = this;
    var vec = new Torch.Vector( (otherSprite.Rectangle.x - that.Rectangle.x), (otherSprite.Rectangle.y - that.Rectangle.y) );
    vec.Normalize();
    return vec;
};
Torch.Sprite.prototype.GetDistance = function(otherSprite)
{
    var that = this;
    var thisVec = new Torch.Vector(that.Rectangle.x, that.Rectangle.y);
    var otherVec = new Torch.Vector(otherSprite.Rectangle.x, otherSprite.Rectangle.y);
    return thisVec.GetDistance(otherVec);
}
Torch.Sprite.prototype.Center = function()
{
    var that = this;
    var width = that.game.canvasNode.width;
    var height = that.game.canvasNode.height;
    var x = (width / 2) - (that.Rectangle.width/2);
    that.Rectangle.x = x;
}

Torch.GhostSprite = function(){};
Torch.GhostSprite.is(Torch.Sprite);
Torch.GhostSprite.prototype.GHOST_SPRITE = true;
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
	}
	if (that.Kill && that.hasRun)
	{
		that.Stop();
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


Torch.Animation.StepAnimation = function(game, totalTime, steps)
{
	this.InitSprite(game, 0, 0);
	this.steps = steps;
	this.totalTime = totalTime;
	this.interval = totalTime / steps.length;
	this.time = 0;
	this.index = 0;
}
Torch.Animation.StepAnimation.is(Torch.GhostSprite);

Torch.Animation.StepAnimation.prototype.Update = function()
{
	var that = this;
	that.time += that.game.deltaTime;
	if (that.time >= that.interval)
	{
		that.time = 0;
		that.index++;
		that.steps[that.index]();
		if (that.index == that.steps.length - 1)
		{
			that.Trash();
		}
	}
}
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
Torch.Text.prototype.TEXT = true;
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
    cnv.height = that.fontSize + 5;
    canvas = cnv.getContext("2d");
    canvas.fillStyle = that.color;
    canvas.font = that.fontWeight + " " + that.fontSize + "px " + that.font;
    canvas.fillText(that.text,0,that.fontSize);
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
    that.BaseUpdate();
    if (that.text != that.lastText)
    {
        that.Render();
        that.lastText = that.text;
    }
}
Torch.Sound = {};

Torch.Sound.PlayList = function(game, playList)
{
    this.songList = playList;
    this.game = game;
    this.currentSong = playList[0];
    this.index = 0;
}
Torch.Sound.PlayList.prototype.Play = function()
{
    var that = this;
    that.game.Assets.GetSound(that.currentSong).play();
}
Torch.Sound.PlayList.prototype.ShuffleArray = function(array)
{
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
Torch.Sound.PlayList.prototype.Randomize = function()
{
    var that = this;
    that.songList = that.ShuffleArray(that.songList);
    that.currentSong = that.songList[0];
}
Torch.Sound.PlayList.prototype.Update = function()
{
    var that = this;
    if (that.game.Assets.GetSound(that.currentSong).currentTime >= that.game.Assets.GetSound(that.currentSong).duration)
    {
        that.index++;
        that.currentSong = that.songList[that.index];
        that.Play();
        if (that.index == that.songList.length - 1)
        {
            that.index = 0;
        }
    }
}
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
Torch.StateMachine = function(obj)
{
    this.currentState = null;
    this.obj = obj;
}
Torch.StateMachine.prototype.Switch = function(newState)
{
    var that = this;
    if (that.currentState && that.currentState.End) that.currentState.End(that.obj);
    if (newState.Start) newState.Start(that.obj);
    that.currentState = newState;
}
Torch.StateMachine.prototype.Update = function()
{
    var that = this;
    that.currentState.Execute(that.obj);
}

Torch.StateMachine.State = function(execute, start, end)
{
    this.Execute = execute;
    this.Start = start;
    this.End = end;
}
Torch.ParticleEmitter = function(x, y, particleDecayTime, step, once)
{
    this.InitSprite(x,y);
    this.PARTICLE_DECAY_TIME = particleDecayTime;
    this.STEP = step;
    this.elapsedTime = 0;

    this.OnEmit = null;
    if (once) this.once = true;
}
Torch.ParticleEmitter.is(Torch.GhostSprite)
Torch.ParticleEmitter.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.elapsedTime += Game.deltaTime;
    if (that.elapsedTime >= that.STEP)
    {
        that.Emit();
        that.elapsedTime = 0;
    }
}
Torch.ParticleEmitter.prototype.KeepParticles = function()
{
    this.keepParticles = true;
}
Torch.ParticleEmitter.prototype.Emit = function()
{
    var that = this;
    that.OnEmit(that);
    if (that.once)
    {
        that.Trash();
    }
}
Torch.ParticleEmitter.prototype.CreateBurstEmitter = function(Particle, density, cx, cy, minX, minY)
{
    var that = this;
    var onEmit = function(emitter)
    {
        var spriteGroup,
            particle;
        var particles = [];
        for (var i = 0; i < density; i++)
        {
            particle = new Particle(that.Rectangle.x, that.Rectangle.y);
            particles.push(particle);
            var xNeg = Math.random() > 0.5 ? 1 : -1;
            var yNeg = Math.random() > 0.5 ? 1 : -1;
            var xDir = Math.random() * ( xNeg );
            var yDir = Math.random() * ( yNeg );
            var dirVector = new Torch.Vector(xDir, yDir);
            dirVector.Normalize();
            particle.Body.x.velocity = ( dirVector.x * cx );
            particle.Body.y.velocity = ( dirVector.y * cy );
        }
        spriteGroup = new Torch.SpriteGroup(particles);
        Torch.Timer.SetFutureEvent(that.PARTICLE_DECAY_TIME, function()
        {
            if (!that.keepParticles)
            {
                spriteGroup.Trash();
            }
            else
            {
                spriteGroup.All(function(sprite){
                    sprite.Body.x.velocity = 0;
                    sprite.Body.y.velocity = 0;
                });
            }
        });
    };
    that.OnEmit = onEmit;
}
Torch.ParticleEmitter.prototype.CreateFountainEmitter = function()
{
    var that = this;
}
Torch.ParticleEmitter.prototype.CreateSlashEmitter = function(Particle, density, minY, vy, point1, point2)
{
    var that = this;
    var onEmit = function(emitter)
    {
        var spriteGroup,
            particle;
        var particles = [];
        var xDist = point2.x - point1.x;
        var xStep = xDist / 10

        for (var j = 0; j < xDist; j++)
        {
            for (var i = 0; i < density; i++)
            {
                particle = new Particle(that.Rectangle.x + (xStep * j), that.Rectangle.y);
                particle.Body.y.velocity = minY + (Math.random() * vy)
            }
        }


        spriteGroup = new Torch.SpriteGroup(particles);
        Torch.Timer.SetFutureEvent(that.PARTICLE_DECAY_TIME, function()
        {
            spriteGroup.Trash();
        });
    };
    that.OnEmit = onEmit;
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
    var that = this;
    this.sprites = sprites;
    for (var i = 0; i < that.sprites.length; i++)
    {
        that.sprites[i].anchorX = that.sprites[i].Rectangle.x;
    }
};
Torch.SpriteGroup.prototype.Add = function(sprites)
{
    var that = this;
    that.sprites = that.sprites.concat(sprites);
}
Torch.SpriteGroup.prototype.Trash = function()
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        that.sprites[i].Trash();
    }
};
Torch.SpriteGroup.prototype.Shift = function(transition)
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        if (transition.x) sprite.Rectangle.x = sprite.anchorX + transition.x;
        //if (transition.y) sprite.Rectangle.y = sprite.Rectangle.y + transition.y;
    }
};
Torch.SpriteGroup.prototype.Hide = function()
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        sprite.draw = false;
    }
};
Torch.SpriteGroup.prototype.Show = function()
{
    var that = this;
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        sprite.draw = true;
    }
}
Torch.SpriteGroup.prototype.All = function(handle)
{
    var that = this
    for (var i = 0; i < that.sprites.length; i++)
    {
        var sprite = that.sprites[i];
        handle(sprite);
    }
}
//planning on integrating this into a platformer physics library
//for torch


Torch.Platformer = {};
Torch.Platformer.Gravity = 0.001;
Torch.Platformer.SetWorld = function(spawnItems)
{
    Torch.Platformer.spawnItems = spawnItems;
}
Torch.Platformer.Actor = function(){} //anything that has any interaction
Torch.Platformer.Actor.prototype.ACTOR = true;
Torch.Platformer.Actor.prototype.Health = 100;
Torch.Platformer.Actor.prototype.currentFriction = 1;
Torch.Platformer.Actor.prototype.inFluid = false;
Torch.Platformer.Actor.prototype.onGround = false;
Torch.Platformer.Actor.prototype.onLeft = false;
Torch.Platformer.Actor.prototype.onTop = false;
Torch.Platformer.Actor.prototype.onRight = false;
Torch.Platformer.Actor.prototype.Hit = function(amount)
{
    var that = this;
    if (amount) that.Health -= amount;
    else that.Health -= 1;

    if (that.Health <= 0)
    {
        that.Die();
    }
}
Torch.Platformer.Actor.prototype.Die = function()
{
    var that = this;
    that.isDead = true;
}
Torch.Platformer.Actor.prototype.BlockCollision = function(item, offset)
{
    var that = this;
    if (offset)
    {
        if (offset.vx < offset.halfWidths && offset.vy < offset.halfHeights)
        {
            if (offset.x < offset.y && Math.abs(offset.x) >= 0.2)
            {
                that.Body.y.velocity = 0;
                if (offset.vx > 0)
                {
                    //colDir = "l";
                    that.Rectangle.x += offset.x;
                    that.Body.x.velocity = 0;
                    that.onLeft = true;
                }
                else
                {
                    //colDir = "r";
                    that.Rectangle.x -= offset.x;
                    that.Body.x.velocity = 0;
                    that.onRight = true;
                }

            }
            else
            {
                if (offset.vy > 0)
                {
                    //colDir = "t";
                    that.Rectangle.y += offset.y;
                    that.Body.y.velocity = 0;
                }
                else if ( Math.abs(offset.sharedXPlane) < 59 )
                {
                    //colDir = "b";
                    that.Rectangle.y -= (offset.y - item.Sprite.sink);
                    that.Body.y.acceleration = 0;
                    that.Body.y.velocity = 0;
                    that.onGround = true;
                    if (!that.inFluid) that.currentFriction = item.Sprite.friction;
                }
            }
        }
    }
}
Torch.Platformer.Actor.prototype.FluidCollision = function(item, offset)
{
    var that = this;
    if (offset)
    {
        that.currentFriction = item.Sprite.friction;
        that.Body.y.acceleration = item.Sprite.gravity;
        that.inFluid = true;
    }

}
Torch.Platformer.Actor.prototype.UpdateActor = function()
{
    var that = this;
    that.inFluid = false;
    that.onGround = false;
    that.onTop = false;
    that.onRight = false;
    that.onLeft = false;
    for (var i = 0; i < Torch.Platformer.spawnItems.length; i++)
    {
        var item = Torch.Platformer.spawnItems[i];
        var rect = that.Rectangle;
        if (item.spawned && item.Sprite && item.Sprite.BLOCK && that.NotSelf(item.Sprite) && (that.ACTOR) )
        {
            var offset = that.Rectangle.Intersects(item.Sprite.Rectangle);
            that.BlockCollision(item, offset);
        }
        if (item.spawned && item.Sprite && item.Sprite.FLUID && that.NotSelf(item.Sprite) && (that.ACTOR) )
        {
            var offset = that.Rectangle.Intersects(item.Sprite.Rectangle);
            that.FluidCollision(item, offset);
        }
        if (item.spawned && item.Sprite && item.Sprite.ENEMY && that.NotSelf(item.Sprite))
        {
            var offset = that.Rectangle.Intersects(item.Sprite.Rectangle);
            if (that.EnemyCollision && offset) that.EnemyCollision(item.Sprite, offset);
        }
        if (item.spawned && item.Sprite && item.Sprite.DOOR && that.NotSelf(item.Sprite) && that.PLAYER)
        {
            var offset = that.Rectangle.Intersects(item.Sprite.Rectangle);
            if (offset)
            {
                item.Sprite.SignGroup.Show();
                if (Game.Keys.G.down)
                {
                    //we're gonna want to clean this up
                    Spawner.UnSpawn();
                    Game.UnSpawn();
                    Spawner.Spawn(TestingWorld[item.Sprite.addData.Room]);
                    Game.Player.Rectangle.x = item.Sprite.addData.x || 0;
                    Game.Player.Rectangle.x = item.Sprite.addData.y || 0;
                }
            }
            else
            {
                item.Sprite.SignGroup.Hide();
            }
        }
    }
    if (!that.onGround && !that.inFluid) that.Body.y.acceleration = Torch.Platformer.Gravity;
}

Torch.Platformer.Block = function(){};
Torch.Platformer.Block.prototype.BLOCK = true;
Torch.Platformer.Block.prototype.friction = 1;
Torch.Platformer.Block.prototype.sink = 0;

Torch.Platformer.Fluid = function(){};
Torch.Platformer.Fluid.prototype.FLUID = true;
Torch.Platformer.Fluid.prototype.friction = 0.3;
Torch.Platformer.Fluid.prototype.gravity = 0.0001;
Torch.Platformer.Fluid.prototype.drawIndex = 30;

Torch.Platformer.Spawner = function(spawnItems)
{
    this.spawnItems = spawnItems;
    Torch.Platformer.SetWorld(spawnItems);
}
Torch.Platformer.Spawner.is(Torch.GhostSprite);
Torch.Platformer.Spawner.prototype.Update = function()
{
    var that = this;
    if(that.spawnItems.length > 0)
    {
        for (var i = 0; i < that.spawnItems.length; i++)
        {
            var item = that.spawnItems[i];
            var viewRect = Game.Viewport.GetViewRectangle();
            if (item.Manual) continue;
            if (!item.spawned && !item.dead && item.DisableDynamicSpawning)
            {
                var spr = that.SpawnTypes[item.SpawnType](item.Position, item, item.addData);
                item.Sprite = spr;
                item.spawned = true;
                spr.spawnItem = item;
                spr.DrawParams = {tint: "green"};
            }
            else if (!item.spawned && !item.dead && viewRect.Intersects( {x: item.Position.x, y: item.Position.y, width: (item.width * Game.SCALE), height: (item.height * Game.SCALE)} ) )
            {
                if (item.SpawnType)
                {
                    var spr = that.SpawnTypes[item.SpawnType](item.Position, item, item.addData);
                    item.Sprite = spr;
                    item.spawned = true;
                    spr.spawnItem = item;
                }
            }
            else if (item.spawned && item.Sprite && item.Sprite.Rectangle && !viewRect.Intersects( {x: item.Sprite.Rectangle.x, y: item.Sprite.Rectangle.y, width: item.Sprite.Rectangle.width, height: item.Sprite.Rectangle.height} ) )
            {
                item.Sprite.Trash();
                item.Sprite = null;
                item.spawned = false;
            }

        }
    }
}

Torch.Platformer.SpawnItem = function(spawnType, spawned, obj, position)
{
    this.spawnType = spawnType;
    this.spawned = spawned;
    this.position = position;
    if (obj)
    {
        this.Sprite = obj;
    }
}


Torch.version='Torch-2016-7-23'