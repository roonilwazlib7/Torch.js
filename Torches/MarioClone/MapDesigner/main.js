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
            SpawnType: SELECTED_ITEM,
            Position: {x: that.x, y: that.y},
            width: Items[SELECTED_ITEM].width,
            height: Items[SELECTED_ITEM].height
        });
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
        $(".dropdown").find("a").click(function(){
            SELECTED_ITEM = $(this).html();
            $("#drop-val").html(SELECTED_ITEM);
            $("#prev-im").attr("src", "Images/" + SELECTED_ITEM + ".png");
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
            }
        });
    }
}

Cursor.Init();

SELECTED_ITEM = "BasicBlock";
Items = {
    "BasicBlock": {
        image: "Images/BasicGround.png",
        width: 32,
        height: 16
    },
    "BasicBrick": {
        image: "Images/BasicBrick.png",
        width: 16,
        height: 16
    },
    "MysteryBlock": {
        image: "Images/MysteryBlock.png",
        width: 16,
        height: 16
    },
    "Pipe": {
        image: "Images/Pipe.png",
        width: 32,
        height: 32
    },
    "Goomba": {
        image: "Images/Goomba.png",
        width: 16,
        height: 16
    }
}
MapData = [];
