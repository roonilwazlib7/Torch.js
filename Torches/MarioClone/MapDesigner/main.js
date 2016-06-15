var Cursor = {
    x: 0,
    y: 0,
    dim: 16,
    html: document.getElementById("cursor"),
    Right: function()
    {
        var that = this;
        that.x += that.dim
        that.html.style.left = 8 + that.x + "px";
    },
    Left: function()
    {
        var that = this;
        that.x -= that.dim;
        that.html.style.left = 8 + that.x + "px";
    },
    Down: function()
    {
        var that = this;
        that.y += that.dim;
        that.html.style.top = 8 + that.y + "px";
    },
    Up: function()
    {
        var that = this;
        that.y -= that.dim;
        that.html.style.top = 8 + that.y + "px";
    },
    Place: function()
    {
        var that = this;
        var path = Items[SELECTED_ITEM].image;
        var im = $("<img src='" + path + "' />");
        im.css("position", "absolute");
        im.css("left", 8 + that.x);
        im.css("top", 8 + that.y);
        $("body").append(im);
        MapData.push({
            SpawnType: Items[SELECTED_ITEM].spawn,
            Position: {x: that.x, y: that.y},
            width: Items[SELECTED_ITEM].width,
            height: Items[SELECTED_ITEM].height,
            args: Items[SELECTED_ITEM].args
        });
        Stack.push(im);
    },
    Import: function()
    {
        var that = this;
        var json = JSON.parse($("#import").val());
        for (var i = 0; i < json.length; i++)
        {
            var item = json[i];
            that.x = item.Position.x;
            that.y = item.Position.y;
            SELECTED_ITEM = item.SpawnType;
            that.Place();
        }
        that.x = 0;
        that.y = 0;
    },
    Init: function()
    {
        var that = this;
        $("#btn-resize").click(function(){
            var width = $("#map-width").val();
            var height = $("#map-height").val();
            $("#main").css({
                width: width,
                height: height
            });
        });
        $(".dropup").find("a").click(function(){
            SELECTED_ITEM = $(this).html();
            $("#drop-val").html(SELECTED_ITEM);
            $("#prev-im").attr("src", "Images/" + Items[SELECTED_ITEM].spawn + ".png");
            that.html.style.width = Items[SELECTED_ITEM].width;
            that.html.style.height = Items[SELECTED_ITEM].height;
        });
        $("#btn-import").click(function(){
            that.Import();
        });
        $("#btn-export").click(function(){
            $("#import").val(JSON.stringify(MapData));
        });
        $(document).bind("keypress",function(e){
            switch (e.keyCode)
            {
                case 100:
                    that.Right();
                    e.preventDefault();
                break;
                case 97:
                    that.Left();
                    e.preventDefault();
                break;
                case 115:
                    that.Down();
                    e.preventDefault();
                break;
                case 119:
                    that.Up();
                    e.preventDefault();
                break;
                case 13:
                    that.Place();
                    e.preventDefault();
                break;
                case 122:
                    $( Stack[Stack.length - 1]).remove();
                    Stack.pop();
                    MapData.pop();
                break;
            }
        });
    }
}

Cursor.Init();

SELECTED_ITEM = "BasicBlock";
Items = {
    "BasicBlock": {
        spawn: "BasicBlock",
        image: "Images/BasicGround.png",
        width: 32,
        height: 16
    },
    "BasicBrick": {
        spawn: "BasicBrick",
        image: "Images/BasicBrick.png",
        width: 16,
        height: 16
    },
    "BasicBrick(Coin)": {
        spawn: "BasicBrick",
        image: "Images/BasicBrick.png",
        width: 16,
        height: 16,
        args: {
            coin: true
        }
    },
    "MysteryBlock": {
        spawn: "MysteryBlock",
        image: "Images/MysteryBlock.png",
        width: 16,
        height: 16
    },
    "MysteryBlock(Coin)":{
        spawn: "MysteryBlock",
        image: "Images/MysteryBlock.png",
        width: 16,
        height: 16,
        args: {
            coin: true
        }
    },
    "Pipe": {
        spawn: "Pipe",
        image: "Images/Pipe.png",
        width: 32,
        height: 32
    },
    "Goomba": {
        spawn: "Goomba",
        image: "Images/Goomba.png",
        width: 16,
        height: 16
    },
    "Cloud": {
        spawn: "Cloud",
        image: "Images/Cloud.png",
        width: 32,
        height: 24
    },
    "Bush": {
        spawn: "Bush",
        image: "Images/Bush.png",
        width: 32,
        height: 16
    },
    "Hill": {
        spawn: "Hill",
        image: "Images/Hill.png",
        width: 74,
        height: 32
    }
}
MapData = [];
Stack = [];
