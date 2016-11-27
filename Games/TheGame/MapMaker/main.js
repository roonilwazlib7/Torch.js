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
}
