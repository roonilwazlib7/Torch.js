Torch.Game = function(canvasId, width, height, name)
{
    console.log("%c   " + Torch.version + "-" + name + "  ", "background-color:#cc5200; color:white");
    this.canvasId = canvasId;
    this.canvasNode = document.getElementById(canvasId);
    this.canvas = this.canvasNode.getContext("2d");

    this.width = width;
    this.height = height;
    this.name = name;

    this.Clear("#cc5200");

    this.Load = new Torch.Load(this);
    this.Viewport = new Torch.Viewport(this);
    this.Mouse = new Torch.Mouse(this);
    this.Keys = new Torch.Keys();

    this.deltaTime = 0;
    this.fps = 0;
    this.averageFps = 0;
    this.allFPS = 0;
    this.ticks = 0;
    this.zoom = 1;
    this.uidCounter = 0;

    this.paused = false;

    this.time = null;
    this.LastTimeStamp = null;

    this.spriteList = [];
    this.taskList = [];
    this.animations = [];
    this.DrawStack = [];
    this.AddStack = [];
    this.GamePads = [];

    this.events = {};
};
Torch.Game.prototype.On = function(eventName, eventHandle)
{
    var that = this;
    that.events[eventName] = eventHandle;
    return that;
}
Torch.Game.prototype.Emit = function(eventName, eventArgs)
{
    var that = this;
    if (that.events[eventName] != undefined)
    {
        that.events[eventName](eventArgs);
    }
    return that;
}
Torch.Game.prototype.PixelScale = function()
{
    var that = this;
    that.canvas.webkitImageSmoothingEnabled = false;
    that.canvas.mozImageSmoothingEnabled = false;
    that.canvas.imageSmoothingEnabled = false;
};
Torch.Game.prototype.Start = function(load, update, draw, init)
{
    var that = this;
    if (!load)
    {
        that.FatalError("Unable to start game '{0}' without load function".format(that.name));
    }
    if (!update)
    {
        that.FatalError("Unable to start game '{0}' without update function".format(that.name));
    }
    if (!draw)
    {
        that.FatalError("Unable to start game '{0}' without draw function".format(that.name));
    }
    if (!init)
    {
        that.FatalError("Unable to start game '{0}' without update function".format(that.name));
    }

    this.load = load;
    this.update = update;
    this.draw = draw;
    this.init = init;

    that.load(that);

    that.Load.Load(function()
    {
        that.init(that);
        that.WireUpEvents();
        that.Run();
    });

    that.canvasNode.width = typeof(that.width) == "string" ? document.body.clientWidth - 50 : that.width;
    that.canvasNode.height = typeof(that.height) == "string" ? document.body.clientHeight - 25 : that.height;
    that.Viewport.width = that.canvasNode.width;
    that.Viewport.height = that.canvasNode.height;
};
Torch.Game.prototype.Add = function(o)
{
    var that = this;
    if (!o || !o._torch_add)
    {
        that.FatalError("Cannot add object: {0} to game".format(o.constructor.name));
    }

    o._torch_uid = "TORCHSPRITE" + that.uidCounter.toString();
    that.AddStack.push(o);
    that.uidCounter++;

};
Torch.Game.prototype.Task = function(task)
{
    var that = this;
    that.taskList.push(task);
}
Torch.Game.prototype.RunGame = function(timestamp)
{
    var that = this;
    if (!that.time)
    {
        that.time = timestamp;
    }

    that.deltaTime = Math.round(timestamp - that.time);
    that.time = timestamp;
    that.canvas.clearRect(0, 0, that.Viewport.width, that.Viewport.height);

    that.draw(that);
    that.update(that);
    that.Viewport.Update();
    that.UpdateAndDrawSprites();
    that.UpdateAnimations();
    that.UpdateTimeInfo();
    that.UpdateTasks();
    Torch.Camera.Update();
    Torch.Timer.Update();
    that.UpdateGamePads();

    window.requestAnimationFrame(function(timestamp)
    {
        that.RunGame(timestamp);
    });
};
Torch.Game.prototype.Run = function(timestamp)
{
    var that = this;
    that.RunGame(0);
};
Torch.Game.prototype.FlushSprites = function()
{
    var that = this;
    for (var i = 0; i < that.spriteList.length; i++)
    {
        that.spriteList[i].Trash();
    }
}
Torch.Game.prototype.FatalError = function(error)
{
    var that = this;

    if (that.fatal) return;
    that.fatal = true;

    if (typeof error == "string")
    {
        error = new Error(error);
    }

    that.Clear("#000");
    var stack = error.stack.replace(/\n/g, "<br><br>");
    $("body").empty();
    $("body").prepend("<code style='color:#C9302C;font-size:18px'>Time: " + that.time + "</code>");
    $("body").prepend("<code style='color:#C9302C;font-size:20px'>" + stack + "</code><br>");
    $("body").prepend("<code style='color:#C9302C;margin-left:15%;font-size:24px'>" + error + "</code><br><code style='color:#C9302C;font-size:20px;font-weight:bold'>Stack Trace:</code><br>");
    that.RunGame = function(){};
    that.Run = function(){};
    that.Emit("FatalError");
    throw error;

};
Torch.Game.prototype.UpdateTasks = function()
{
    var that = this;
    for (var i = 0; i < that.taskList.length; i++)
    {
        that.taskList[i]();
    }
}
Torch.Game.prototype.UpdateSprites = function()
{
    var that = this;

    var updateList = that.spriteList;
    var cleanedUpdateList = [];

    for (var i = 0; i < updateList.length; i++)
    {
        var sprite = updateList[i];
        if (!sprite.trash)
        {
            if (!sprite.game.paused)sprite.Update();
            cleanedUpdateList.push(sprite);
        }
        else
        {
            sprite.trashed = true;
            if (sprite.OnTrash) sprite.OnTrash();
        }
    }

    that.spriteList = cleanedUpdateList;
}
Torch.Game.prototype.DrawSprites = function()
{
    var that = this;
    var drawList = that.spriteList;
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
}
Torch.Game.prototype.UpdateAndDrawSprites = function()
{
    var that = this;
    if (that.loading) return;

    that.DrawSprites();
    that.UpdateSprites();

    for (var i = 0; i < that.AddStack.length; i++)
    {
        var o = that.AddStack[i];
        that.spriteList.push(o);
    }

    that.AddStack = [];
};
Torch.Game.prototype.UpdateAnimations = function()
{
    var that = this;
    for (var i = 0; i < that.animations.length; i++)
    {
        var anim = that.animations[i];
        anim.Run();
    }
}
Torch.Game.prototype.UpdateTimeInfo = function()
{
    var that = this;
    that.fps = Math.round(1000 / that.deltaTime);
    that.allFPS += that.fps == Infinity ? 0 : Math.round(1000 / that.deltaTime);
    that.ticks++;
    that.averageFps = Math.round(that.allFPS / that.ticks);
}
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

    that.canvas.globalAlpha = params.alpha != undefined ? params.alpha : that.canvas.globalAlpha;

    that.canvas.translate(x + width / 2, y + height / 2);

    that.canvas.rotate(rotation);

    if (params.IsTextureSheet)
    {
        that.canvas.drawImage(texture.image, params.clipX, params.clipY, params.clipWidth, params.clipHeight, -width/2, -height/2, rectangle.width, rectangle.height);
    }
    else
    {
        that.canvas.drawImage(texture.image, -width/2, -height/2, rectangle.width, rectangle.height);
    }

    that.canvas.rotate(0);
    that.canvas.globalAlpha = 1;

    that.canvas.restore();
};
Torch.Game.prototype.Clear = function(color)
{
    var that = this;

    if (color == undefined)
    {
        that.FatalError("Cannot clear undefined color");
    }
    if (typeof color == "object")
    {
        color = color.hex;
    }

    that.canvasNode.style.backgroundColor = color;
}
Torch.Game.prototype.getCanvasEvents = function()
{
    var that = this;
    var evts = [
        [
            "mousemove", function(e){
                that.Mouse.SetMousePos(that.canvasNode, e);
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
Torch.Game.prototype.TogglePause = function()
{
    if (!this.paused) this.paused = true;
    else this.paused = false;
}
