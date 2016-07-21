var DEFS = [
    BasicBlock
]
var testMap = "-1f4 c0 0 -1b4 c0 0 -174 c0 0 -134 c0 0 -f4 c0 0 -f4 100 0 -f4 140 0 -f4 180 0 -f4 1c0 0 -b4 1c0 0 -74 1c0 0 c 1c0 0 4c 1c0 0 8c 1c0 0 18c 1c0 0 1cc 1c0 0 20c 1c0 0 20c 180 0 20c 140 0 20c c0 0 20c 100 0 24c c0 0 28c c0 0 2cc c0 0 30c c0 0";
function parseMapString(map)
{
    var X = [];
    var Y = [];
    var Sprites = [];
    var exportedMap = [];
    map = map.split(" ");


    for (var i = 0; i < map.length; i+=3)
    {
        if (map[i])
        {
            X.push(parseInt(map[i], 16));
        }
    }
    for (var i = 1; i < map.length; i+=3)
    {
        if (map[i])
        {
            Y.push(parseInt(map[i], 16));
        }
    }
    for (var i = 2; i < map.length; i+=3)
    {
        if (map[i])
        {
            Sprites.push(DEFS[parseInt(map[i], 16)]);
        }
    }
    for (var i = 0; i < map.length/3; i++)
    {
        var spawnItem = new Torch.Platformer.SpawnItem(Sprites[i], true, new Sprites[i](Game, X[i], Y[i]));
        exportedMap.push(spawnItem);
    }
    return exportedMap;
}
