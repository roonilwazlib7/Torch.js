var DEFS = [
    Blocks.DirtBlock
]

function parseMapString(map)
{
    var positionsX = map.split("0xffffff")[1];
    var positionsY = map.split("0xffffff")[2];
    var defs = map.split("0xffffff")[0];

    var xPositions = positionsX.split(" ");
    var yPositions = positionsY.split(" ");
    var allDefs = defs.split(" ");

    for (var i = 0; i < allDefs.length; i++)
    {
        var item = new DEFS[parseInt(allDefs[i],16)](parseInt(xPositions[i],16), parseInt(yPositions[i],16))
    }
}
