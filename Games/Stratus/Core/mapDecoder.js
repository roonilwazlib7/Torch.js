var DEFS = Factory.Block.objects.concat(Factory.Background.objects).concat(Factory.Enemy.objects);

var MapManager = function()
{
    this.spawner = null;
    this.maps = {};
}
MapManager.prototype.LoadMap = function(mapId, playerLocation)
{
    var that = this;
    if (that.spawner != null)
    {
        that.spawner.FlushSprites();
    }
    if (player)
    {
        player.Trash();
    }
    //hack for now
    for (var i = 0; i < Game.spriteList.length; i++)
    {
        if (Game.spriteList[i].ACTOR)
        {
            Game.spriteList[i].Trash();
        }
    }
    player = new Player(Game, playerLocation.x, playerLocation.y);
    that.spawner = new Torch.Platformer.Spawner(parseMapString( that.maps[mapId] ));
}
MapManager.prototype.AddMap = function(mapId, mapData)
{
    var that = this;
    that.maps[mapId] = mapData;
    return that;
}


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
