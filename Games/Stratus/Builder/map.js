var fs = require('fs');
var Map = {};

Map.X = 0;
Map.Y = 0;
Map.Scale = 4;
Map.CurrentItem = 0;
Map.Buffer = "";
Map.Flags = "";
Map.Name = "MAP";
Map.Cursor = $("#cursor");

Map.RightArrow = 39;
Map.LeftArrow = 37;
Map.BottomArrow = 40;
Map.TopArrow = 38;

Map.CreateGrid = function(columns, rows)
{
    var that = this;
    var base = 16;
    that.Scale = parseInt($("#map-scale").val());
    var computed = base * that.Scale;
    that.Buffer = "";
    $("#map-out").empty();
    for (var i = 0; i < columns; i++)
    {
        for (var j = 0; j < rows; j++)
        {
            var cell = $("<div class='cell'></div>");
            var x = i * computed;
            var y = j * computed;
            cell.css({
                width: computed,
                height: computed,
                left: x,
                top: y
            });
            cell.attr("map-x", x);
            cell.attr("map-y", y);
            cell.click(function(){
                that.AddItem(parseInt($(this).attr("map-x")), parseInt($(this).attr("map-y")));
            });
            $("#map-out").append(cell);
        }
    }
}

Map.AddItem = function(x,y)
{
    var that = this;
    var flags = $("#flags").val();
    if (flags == "") flags = "0";
    $("#flags").val("");
    that.Buffer += x.toString(16) + " " + y.toString(16) + " " + that.CurrentItem.toString(16) + " ";
    that.Flags += flags + " ";
    var im = $("<img src='" + DEFS[that.CurrentItem].prototype.map + "' />");
    im.css({
        position: "absolute",
        left: x,
        top: y,
        width:DEFS[that.CurrentItem].prototype.baseWidth * that.Scale,
        height:DEFS[that.CurrentItem].prototype.baseHeight * that.Scale
    });
    $("#map-out").append(im);
}

Map.SetUpMenu = function()
{
    var that = this;
    for (var i = 0; i < DEFS.length; i++)
    {
        var item = $('<li><a href="#" i = "' + i + '">' + DEFS[i].prototype.asset + '<img src="' + __dirname.replace(/\\/g, "/") + "/../" + DEFS[i].prototype.asset + '.png" /></a></li>');
        item.find("a").click(function(){
            that.CurrentItem = parseInt( $(this).attr("i") );
            $("#current-item-display").html(DEFS[that.CurrentItem].prototype.asset);
        });
        $("#item-select").append(item);
    }
}

Map.Export = function()
{
    var that = this;
    var buffer = that.Buffer.substring(0, that.Buffer.length - 1);
    var flags = that.Flags.substring(0, that.Flags.length - 1);
    var ex = that.Name + ";" + that.Scale + ";" + buffer + ";" + flags;
    fs.writeFile($("#inout").val(), ex, 'utf8', function(er, data)
    {

    });
}

Map.Init = function()
{
    var that = this;
    $(document).keyup(function(e){
        switch(e.keyCode)
        {
            case that.RightArrow:
                that.MoveRight();
                break;
            case that.LeftArrow:
                that.MoveLeft();
                break;
            case that.BottomArrow:
                that.MoveBottom();
                break;
            case that.TopArrow:
                that.MoveTop();
                break;
        }
    });
    $("#new-map").click(function(){
        that.Name = $("#map-name").val();
        var width = parseInt($("#map-width").val());
        var height = parseInt($("#map-height").val());
        Map.CreateGrid(width, height);
    });

    $("#menu").draggable();

    Map.SetUpMenu();
}

Map.Init();


//a sample map output:
var sampMap = "MySampleMap;2;0 0 1 40 0 1 c2 20 1";
