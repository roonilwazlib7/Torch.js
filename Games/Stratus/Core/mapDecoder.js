var DEFS = Factory.Block.objects.concat(Factory.Enemy.objects).concat(Factory.Background.objects);

function parseMapString(map)
{
    var X = [];
    var Y = [];
    var Sprites = [];
    var exportedMap = [];
    var args = map.split(";")[3].split(" ");
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
        var spawnItem = new Torch.Platformer.SpawnItem(Sprites[i], true, new Sprites[i](Game, X[i], Y[i], args[i]));
        exportedMap.push(spawnItem);
    }
    return exportedMap;
}
