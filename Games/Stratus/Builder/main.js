var Cursor = {
    x: 0,
    y: 0,
    slideX: 0,
    dim: function(){
        return this.scale * 16;
    },
    scale: 4,
    html: document.getElementById("cursor"),
    Right: function()
    {
        var that = this;
        that.x += that.dim()
        that.html.style.left = 8 + that.x + "px";
    },
    Left: function()
    {
        var that = this;
        that.x -= that.dim();
        that.html.style.left = 8 + that.x + "px";
    },
    Down: function()
    {
        var that = this;
        that.y += that.dim();
        that.html.style.top = 8 + that.y + "px";
    },
    Up: function()
    {
        var that = this;
        that.y -= that.dim();
        that.html.style.top = 8 + that.y + "px";
    },
    Place: function()
    {
        var that = this;
        var path = Items[SELECTED_ITEM].image;
        var im = $("<img src='" + path + "' />");
        var addData = $("#addData").val();
        im.css("position", "absolute");
        im.css("left", 8 + that.x);
        im.css("top", 8 + that.y);
        im[0].width = im[0].width * that.scale;
        im[0].height = im[0].height * that.scale;
        im[0].style.imageRendering = "pixelated";
        $("body").append(im);
        var mapItem = {
            SpawnType: Items[SELECTED_ITEM].spawn,
            Position: {x: that.x + that.slideX, y: that.y},
            width: Items[SELECTED_ITEM].width * that.scale,
            height: Items[SELECTED_ITEM].height * that.scale,
            args: Items[SELECTED_ITEM].args
        }
        MapData += mapItem.Position.x.toString(16) + " " + mapItem.Position.y.toString(16) + " " + Items[SELECTED_ITEM].i.toString(16) + " ";
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
        var LOCKED = false;
        $("textarea").focus(function(){
            LOCKED = true;
        });
        $("textarea").blur(function(){
            LOCKED = false;
        });
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
            that.html.style.width = Items[SELECTED_ITEM].width * that.scale;
            that.html.style.height = Items[SELECTED_ITEM].height * that.scale;

        });
        $("#btn-import").click(function(){
            that.Import();
        });
        $("#btn-export").click(function(){
            $("#import").val(MapData);
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
                    if (LOCKED) return;
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
    "StoneBlock": {
        spawn: "StoneBlock",
        image: "Images/StoneBlock.png",
        width: 16,
        height: 16,
        i: 0
    },
}
MapData = "";
Stack = [];
