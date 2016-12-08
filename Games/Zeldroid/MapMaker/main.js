$(document).ready(function(){

    $( "#menu" ).draggable();

    var LENGTH = 36;
    var HEIGHT = 24;

    for (var i = 0; i < LENGTH; i++)
    {
        for (var j = 0; j < HEIGHT; j++)
        {
            GenerateCell(i,j);
        }
    }

    $("#map-export").click(function(){
        ExportMap();
    });
    $("#map-import").click(function(){
        ImportMap();
    });

    LoadMapOptions();
})

var fs = require("fs");

var SELECTED_PIECE = null,
    SCALE = 4,
    BASE = 16;


function GenerateCell(x,y)
{
    var cell = $("<div class = 'cell'></div>");
    var MOUSE_DOWN = false,
        SHIFT_DOWN = false;

    cell.attr("id", "cell-" + x + y);

    cell.data("x", x);
    cell.data("y", y);

    cell.css({
        position: "absolute",
        left: x * BASE * SCALE,
        top: y * BASE * SCALE
    });

    $("#grid").append(cell);

    cell.click(function(){
        HandleCellClick($(this));
    });

    cell.mouseenter(function(){
        var cell = $(this);
        if (MOUSE_DOWN && SHIFT_DOWN)
        {
            HandleCellClick(cell);
        }
        return false;
    });

    $(document).keydown(function(e){
        if (e.keyCode == 16)
        {
            SHIFT_DOWN = true;
        }
    });
    $(document).keyup(function(e){
        if (e.keyCode == 16)
        {
            SHIFT_DOWN = false;
        }
    });

    $(document).mousedown(function(){
        MOUSE_DOWN = true;
    });
    $(document).mouseup(function(){
        MOUSE_DOWN = false;
    });
}

function HandleCellClick(cell)
{
    if (SELECTED_PIECE == null) return;
    if (SHIFT_DOWN) cell.empty();
    var im = $("<img src='../Assets/Art/map/" + MapPieces[SELECTED_PIECE].prototype.textureId + ".png' class = 'placed-peice'/>");
    im.data("x", cell.data("x"));
    im.data("y", cell.data("y"));
    im.data("identifier", MapPieces[SELECTED_PIECE].prototype.identifier);
    cell.append(im);
}

function ExportMap()
{
    var map = new MAP();

    var mapString = "name:{name};author:{author};generated:{generated}\n{data}";

    mapString = mapString.replace("{name}", map.name);
    mapString = mapString.replace("{author}", map.author);
    mapString = mapString.replace("{generated}", map.generated);
    mapString = mapString.replace("{data}", map.data);

    fs.writeFileSync("Maps/" + map.name + ".map", mapString);
}

function ImportMap()
{
    var m = new MAP(),
        mm = new MapManager(),
        mapString = fs.readFileSync("Maps/" + m.name + ".map").toString(),
        pieces = [];

    var sp = mapString.split("\n");

    var metaData = sp[0],
        mapString = sp[1];

    var segments = mapString.split(";");

    $(".cell").empty();

    for (var i = 0; i < segments.length; i++)
    {
        var segment = segments[i];
        if (segment == "") break;



        var identifier = segment.split(",")[0]
        var segs = []

        var segs = segment.split(",")

        var im = $("<img src='../Art/map/" + mm.Parts[identifier].prototype.textureId + ".png' class = 'placed-peice'/>");
        var cell = $("#cell-" + parseInt(segs[1], 16) + parseInt(segs[2], 16));
        cell.empty();

        im.data("x", cell.data("x"));
        im.data("y", cell.data("y"));
        im.data("identifier", mm.Parts[identifier].prototype.identifier);
        cell.append(im);
    }
}

function LoadMapOptions()
{
    var img, option, p, title;
    for (key in MapPieces)
    {
        p = MapPieces[key].prototype;
        img = $("<img src='../Assets/Art/map/" + p.textureId + ".png' />");
        option = $("<div class='option'></div>");
        title = $("<p>" + p.textureId + "</p>");

        option.append(img);
        option.append(title);
        option.data("piece-key", key)

        $("#map-options").append(option);

        option.click(function(){

            $(".option").css("background-color", "");

            $(this).animate({
                "background-color": "green"
            });

            SELECTED_PIECE = $(this).data("piece-key");

        });
    }
}

function MAP()
{
    var that = this;
    that.name = $("#map-name").val();
    that.author = $("#map-author").val();
    that.generated = new Date().toString();

    that.data = "";

    $(".placed-peice").each(function(){
        var p = $(this);
        that.data += parseInt(p.data("identifier").toString(16)) + ",";
        that.data += parseInt(p.data("x")).toString(16) + ",";
        that.data += parseInt(p.data("y")).toString(16);
        that.data += ";";
    });

    if (that.name == "") that.name = "New Map";
    if (that.author == "") that.author = "Team";
}
MAP.prototype = {}
