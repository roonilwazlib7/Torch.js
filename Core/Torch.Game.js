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
    var stack = error.stack.replace(/\n/g, "<br><br>");
    $("canvas").remove();
    $("body").prepend("<code style='color:#C9302C;font-size:18px'>Time: " + that.time + "</code>");
    $("body").prepend("<code style='color:#C9302C;font-size:20px'>" + stack + "</code><br>");
    $("body").prepend("<code style='color:#C9302C;margin-left:15%;font-size:24px'>" + error + "</code><br><code style='color:#C9302C;font-size:20px;font-weight:bold'>Stack Trace:</code><br>");
    throw error;

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
