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

    LoadMapOptions();
})

var SELECTED_PIECE = null;


function GenerateCell(x,y)
{
    var cell = $("<div class = 'cell'></div>");

    cell.attr("id", "cell-" + x + y);

    cell.css({
        position: "absolute",
        left: x * 64,
        top: y * 64
    });

    $("#grid").append(cell);

    cell.click(function(){
        HandleCellClick($(this));
    });
}

function HandleCellClick(cell)
{
    if (SELECTED_PIECE == null) return;
    cell.empty();
    var im = $("<img src='../Art/map/" + MapPieces[SELECTED_PIECE].prototype.textureId + ".png' class = 'placed-peice'/>");
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

    alert(mapString);
}

function LoadMapOptions()
{
    var img, option, p, title;
    for (key in MapPieces)
    {
        p = MapPieces[key].prototype;
        img = $("<img src='../Art/map/" + p.textureId + ".png' />");
        option = $("<div class='option'></div>");
        title = $("<p>" + p.textureId + "</p>");

        option.append(img);
        option.append(title);
        option.data("piece-key", key)

        $("#map-options").append(option);

        option.click(function(){

            $("option").css("background-color", "transparent");

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
    that.data = ";;"
}
MAP.prototype = {}
