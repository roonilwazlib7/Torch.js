var testMap = "MyMap;4;0 2c0 0 40 2c0 0 80 2c0 0 c0 2c0 0 100 2c0 0 140 2c0 0 180 2c0 0 1c0 2c0 0 100 280 1 140 240 1 180 200 1 1c0 1c0 1 1c0 280 0 1c0 240 0 1c0 200 0 180 240 0 180 280 0 140 280 0 200 1c0 0 240 1c0 0 280 1c0 0 280 200 0 280 240 0 280 280 0 280 2c0 0 240 2c0 0 200 2c0 0 200 280 0 240 280 0 240 240 0 200 240 0 200 200 0 240 200 0;0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0";
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
