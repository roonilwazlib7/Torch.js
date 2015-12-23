var Torch = {};
Torch.activeGame = null;
Torch.animations = [];

Torch.Run = function(Game)
{
    var that = Torch;
    //that.WireUpEvents();
    window.requestAnimationFrame(function(timestamp)
    {
        that.activeGame.Run(timestamp, that.activeGame);
    });
};

Torch.Loop = function(timestamp)
{
    var that = Torch;


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
};
(function(){

	var Rectangle = new Class(function(x, y, width, height){
		;"Rectangle";
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	});

	Rectangle.Prop("x", 0);
	Rectangle.Prop("y", 0);
	Rectangle.Prop("width", 0);
	Rectangle.Prop("height", 0);

	Rectangle.Prop("Intersects", function(rectangle)
	{
		var a = this;
		var b = rectangle;
		if (a.x < (b.x + b.width) && (a.x + a.width) > b.x && a.y < (b.y + b.height) && (a.y + a.height) > b.y)
		{
			return true;
		}
		else
		{
			return false;
		}
	});

	Rectangle.Prop("Scale", function(scale)
	{
		this.width = scale * Pipin.Viewport.width;
		this.height = scale * Pipin.Viewport.height;
	});

	Torch.Rectangle = Rectangle;

})();

(function(){

	var Vector = new Class(function(x, y){
		;"Vector";
		this.x = x;
		this.y = y;
	});

	Vector.Prop("Normalize", function()
	{
		var that = this;
		var r = (that.x * that.x) + (that.y * that.y);
		r = Math.sqrt(r);

		var x = that.x;
		var y = that.y;

		that.x = x / r;
		that.y = y / r;
	});

	Torch.Vector = Vector;

})();

var TorchError = new Class(function(error)
{
    ;"TorchError";
    throw "Torch Error: " + error;
});



(function()
{

    var World = new Class(function(game)
    {
        ;"World";
        this.game = game;
        this.bounds = { left: 0, right: 1280, top: 0, bottom: 720};
    });

    World.Prop("Center", function(sprite)
    {
        var that = this;
        var pointCenterX = (that.bounds.right - that.bounds.left) / 2;
        var pointCenterY = (that.bounds.bottom - that.bounds.top) / 2;

        sprite.Rectangle.x = (pointCenterX - ( sprite.Rectangle.width / 2) );
        sprite.Rectangle.y = (pointCenterY - ( sprite.Rectangle.height / 2) );
    });

    World.Prop("SetBounds", function(left, right, top, bottom)
    {
        var that = this;
        that.bounds = {left: left, right: right, top: top, bottom: bottom};
    });

    Torch.World= World;

})();


(function()
{

    var Game = new Class(function(canvasId, width, height, name)
    {
        console.log("%c   Torchv0.0.1   ", "background-color:#cc5200; color:white");
        this.canvasId = canvasId;
        this.canvasNode = document.getElementById(canvasId);
        this.canvas = this.canvasNode.getContext("2d");
        this.width = width;
        this.height = height;
        this.name = name;
        this.Load = new Torch.Load(this);
        this.World = new Torch.World(this);
        this.Clear("#cc5200");
        this.Viewport.game = this;
        var that = this;

    });

    Game.Prop("deltaTime", 0);
    Game.Prop("fps", 0);
    Game.Prop("zoom", 1);
    Game.Prop("time", null);
    Game.Prop("LastTimeStamp", null);
    Game.Prop("spriteList", []);
    Game.Prop("textList", []);
    Game.Prop("animations", []);
    Game.Prop("Text", {});

    Game.Prop("Start", function(load, update, draw, init)
    {
        var that = this;
        this.load = load;
        this.update = update;
        this.draw = draw;
        this.init = init;
        this.DrawStack = [];

        that.canvasNode.width = that.width;
        that.canvasNode.height = that.height;

        that.load();
        that.Load.Load(function()
        {
            that.init();
            that.WireUpEvents();
            Torch.activeGame = that;
            Torch.Run(that);
        });



    });
    Game.Prop("Add", function(o)
    {
        var that = this;
        switch (o._torch_add)
        {
            case "Text":
                that.textList.push(o);
                o.listPosition = that.textList.length - 1;
            break;
            case "Sprite":
                o.game = that;
                that.spriteList.push(o);
                o.listPosition = that.spriteList.length - 1;
            break;
        }
    });
    Game.Prop("Run", function(timestamp)
    {
        var that = this;
        var en = Torch;
        
        that.canvas.clearRect(0, 0, that.Viewport.width, that.Viewport.height);

        this.draw();
        this.update();
        this.Viewport.Update();

        that.fps = (1000 / that.deltaTime);

        var drawList = [];
        drawList = drawList.concat(that.textList);
        drawList = drawList.concat(that.spriteList);

        drawList.sort(function(a, b){
            return a.drawIndex - b.drawIndex;
        });

        drawList.forEach(function(drawItem)
        {
            switch (drawItem._torch_add)
            {
                case "Text":
                    var text = drawItem;
                    if (text.show)
                    {
                        var cordX = text.fixed ? text.x : text.x + that.Viewport.x;
                        var cordY = text.fixed ? text.y : text.y + that.Viewport.y;
                        if (!text.additionalParameters) text.additionalParameters = {};
                        that.canvas.save();
                        that.canvas.font = text.additionalParameters.font ? text.additionalParameters.font : that.canvas.font;
                        that.canvas.fillStyle = text.additionalParameters.fillStyle ? text.additionalParameters.fillStyle : that.canvas.fillStyle;
                        that.canvas.fillText(text.text, cordX, cordY);
                        that.canvas.restore();
                    }
                break;

                case "Sprite":
                    var sprite = drawItem;
                    sprite.Draw();
                    sprite.Update();
                break;
            }
        });

        that.animations.forEach(function(animation)
        {
            animation.Run();
        });

        Torch.Loop(timestamp);
    });

    Game.Prop("Zoom", function(speed)
    {
        var that = this;
        that.zoom += that.deltaTime * speed;
        that.canvasNode.style.zoom = that.zoom;
    });
    Game.Prop("Draw", function(texture, rectangle, params)
    {
        //console.log("drawing...");
        var that = this;

        viewRect = that.Viewport.GetViewRectangle(that);
        if (!rectangle.Intersects(viewRect)) return;
        if (!params) params = {};
        that.canvas.save(); //save the state of the  canvas

        var x = rectangle.x + that.Viewport.x; //get x coordinate for drawing, adjust for viewport position
        var y = rectangle.y + that.Viewport.y; //get y coordinates for drawing, adjust for viewport position
        var width = rectangle.width;
        var height = rectangle.height;
        var rotation = params.rotation ? params.rotation + that.Viewport.rotation: that.Viewport.rotation;

        that.canvas.globalAlpha = params.alpha ? params.alpha : that.canvas.globalAlpha;
        that.canvas.translate(x + width / 2, y + height / 2);
        that.canvas.rotate(rotation);
        if (params.clipWidth)
        {
            that.canvas.drawImage(texture.image, params.clipX, params.clipY, params.clipWidth, params.clipHeight, -width/2, -height/2, rectangle.width, rectangle.height);
        }
        else
        {
            //console.log("drawing...");
            //console.log(texture.image, -width/2, -height/2, rectangle.width, rectangle.height);
            that.canvas.drawImage(texture.image, -width/2, -height/2, rectangle.width, rectangle.height);
        }

        that.canvas.rotate(0);
        that.canvas.globalAlpha = 1;

        that.canvas.restore();
    });

    Game.Prop("Clear", function(color)
    {
        var that = this;
        that.canvasNode.style.backgroundColor = color;
    });


    Game.Prop("getCanvasEvents", function()
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
    });

    var bodyEvents =
    [
        [
            "keydown", function(e){
                e.preventDefault();
                e.stopPropagation();
                Keys[String.fromCharCode(e.keyCode).toUpperCase()].down = true;
            }
        ],
        [
            "keyup", function(e){
                e.preventDefault();
                e.stopPropagation();
                Keys[String.fromCharCode(e.keyCode).toUpperCase()].down = false;
            }
        ]
    ];

    var Keys = (function(){
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
        return _keys;
    })();

    Game.Prop("Keys", Keys);

    Game.Prop("Viewport",
    {
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

                }
            },

			Maximize: function(){
				$(canvasElement).attr("width", Viewport.maxWidth);

				$(canvasElement).attr("height", Viewport.maxWidth * 0.5);

				Viewport.width = Viewport.maxWidth;
				Viewport.height = Viewport.maxWidth * 0.5;
			},

			GetViewRectangle: function(game)
            {
                var that = this.game//game;
				 return new Torch.Rectangle(-that.Viewport.x, -that.Viewport.y, that.Viewport.width, that.Viewport.height);
			},

            Follow: function(sprite)
            {
                this.followSprite = sprite;
            }
	});

    Game.Prop("Mouse",
    {
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
    });


    Game.Prop("WireUpEvents", function()
    {
        var that = this;
        $(that.getCanvasEvents()).each(function(){
            var eventItem = $(this);
            that.canvasNode.addEventListener(eventItem[0], eventItem[1], false);
        });

        $(bodyEvents).each(function(){
            var eventItem = $(this);
            document.body.addEventListener(eventItem[0], eventItem[1], false);
        });
    });




    Torch.Game = Game;
})();




(function(Game)
{

    var Text = new Class(function(text, x, y, additionalParameters)
    {
        var that = this;
        that.text = text;
        that.y = y;
        that.x = x;
        that.show = true;
        that.additionalParameters = additionalParameters;
        that._torch_add = "Text";
        that.drawIndex = 1;
        that.fixed = false;
    });

    Text.Prop("Hide", function()
    {
        var that = this;
        that.show = false;
    });

    Text.Prop("Show", function()
    {
        var that = this;
        that.show = true;
    });

    Text.Prop("Fix", function()
    {
        var that = this;
        that.fixed = true;
    });

    Torch.Text = Text;

})();
