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

})

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

function HandleCellClick()
{

}

function ExportMap()
{
    var map = new MAP();

    var mapString = "[name:{name}];[author:{author}];[generated:{generated}]\n{data}";

    mapString = mapString.replace("{name}", map.name);
    mapString = mapString.replace("{author}", map.author);
    mapString = mapString.replace("{generated}", map.generated);
    mapString = mapString.replace("{data}", map.data);

    alert(mapString);
}
