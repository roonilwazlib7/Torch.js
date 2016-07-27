var testMap = "MyMap;4;0 200 0 40 200 0 80 200 0 c0 200 0 100 200 0 140 200 0 0 1c0 0 0 180 0 180 200 0 200 200 0 1c0 200 0 240 200 0 280 200 0 2c0 200 0 300 200 0 340 200 0 380 200 0 3c0 200 0 3c0 1c0 0 3c0 180 0;0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0";
var DEFS = Factory.Block.objects.concat(Factory.Enemy.objects);

function parseMapString(map)
{
    var X = [];
    var Y = [];
    var Sprites = [];
    var exportedMap = [];
    map = map.split(";")[2].split(" ");


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
