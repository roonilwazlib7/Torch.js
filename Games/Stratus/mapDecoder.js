var DEFS = [
    BasicBlock
]

var testMap = "0 140 0 40 140 0 80 140 0 c0 140 0 100 140 0 140 140 0 180 140 0 1c0 140 0 200 140 0 240 140 0 280 140 0 2c0 140 0 300 140 0 340 140 0 3c0 140 0 380 140 0 3c0 180 0 3c0 1c0 0 380 1c0 0 340 1c0 0 300 1c0 0 2c0 1c0 0 280 1c0 0 240 1c0 0 200 1c0 0 1c0 1c0 0 180 1c0 0 140 1c0 0 100 1c0 0 c0 1c0 0 80 1c0 0 40 1c0 0 0 1c0 0 0 180 0 40 180 0 80 180 0 c0 180 0 100 180 0 140 180 0 180 180 0 1c0 180 0 200 180 0 240 180 0 280 180 0 2c0 180 0 300 180 0 340 180 0 380 180 0 440 140 0 440 180 0 440 1c0 0 400 1c0 0 3c0 100 0 3c0 c0 0 400 c0 0 440 c0 0 440 100 0";

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
