var Spawner = {
    SpawnScaffold: [],
    StoredStripPatterns: {},
    SpawnTypes: {
        StoneBlock: function(position, scaffoldObject)
        {
            return new StoneBlock(position, scaffoldObject);
        },
        GrassBlock: function(position, scaffoldObject)
        {
            return new GrassBlock(position, scaffoldObject);
        },
        Mountain: function(position, scaffoldObject)
        {
            return new Mountain(position, scaffoldObject);
        },
        Tree: function(position, scaffoldObject)
        {
            return new Tree(position, scaffoldObject);
        },
        DayDoor: function(position, scaffoldObject, addData)
        {
            return new DayDoor(position, scaffoldObject, addData);
        },
        NightDoor: function(position, scaffoldObject)
        {
            return new NightDoor(position, scaffoldObject);
        }
    },
    /*
        Spawn will go through spawn items and add them to 'SpawnScaffold'.
        Spawner.Update will then determine if the spawn items need to be
        added or removed
    */
    CopyString: function(str, copies)
    {
        var builtString = "";
        for (var i = 0; i < copies; i++)
        {
            builtString += str;
        }
        builtString = builtString.substring(0, builtString.length - 1);
        return builtString;
    },
    UnSpawn: function()
    {
        var that = this;
        for (var i = 0; i < that.SpawnScaffold.length; i++)
        {
            if (that.SpawnScaffold[i].Sprite)
            {
                that.SpawnScaffold[i].Sprite.Trash();
            }
        }
        that.SpawnScaffold = [];
        that.StoredStripPatterns = [];
    },
    Spawn: function(spawnData)
    {
        var that = this;
        var items = spawnData.Items;
        var currentPosition = spawnData.startPoint;

        for (var i = 0; i < items.length; i++)
        {
            var item = items[i];
            if (item.Strip && !item.StripPattern)
            {
                currentPosition = that.SpawnStrip(item, currentPosition);
                if (item.StoreStripPattern) that.StoredStripPatterns[item.StoreStripPattern] = item;
            }
            else if (item.Strip && item.StripPattern)
            {
                currentPosition = that.SpawnStrip(that.StoredStripPatterns[item.StripPattern], currentPosition);
            }
            else if (!item.PositionSet)
            {
                currentPosition = that.SpawnSingleItem(item, currentPosition);
            }
            else if (item.PositionSet)
            {
                currentPosition = item.PositionSet;
            }
        }
    },
    SpawnSingleItem: function(item, currentPosition)
    {
        var that = this;
        var computedPosition = {x: 0, y:0};
        if (item.Position.x == "right")computedPosition.x = currentPosition.x + item.width;
        else if (item.Position.x == "left")computedPosition.x = currentPosition.x - item.width;
        else if (item.Position.x == "stay")computedPosition.x = currentPosition.x;
        else computedPosition.x = item.Position.x;

        if (item.Position.y == "down")computedPosition.y = currentPosition.y + item.height;
        else if (item.Position.y == "up")computedPosition.y = currentPosition.y - item.height;
        else if (item.Position.y == "stay")computedPosition.y = currentPosition.y;
        else computedPosition.y = item.Position.y;

        var bluePrint = {
            SpawnType: item.SpawnType,
            Position: computedPosition,
            addData: item.addData
        };
        if (item.DisableDynamicSpawning) bluePrint.DisableDynamicSpawning = true;
        that.SpawnScaffold.push(bluePrint);
        return computedPosition;
    },
    SpawnStrip: function(item, currentPosition)
    {
        var that = this;
        var StripPath = item.StripPath;
        if (item.copies) StripPath = that.CopyString(StripPath, item.copies);
        var savedPos = {x: currentPosition.x, y: currentPosition.y};
        var paths = StripPath.split(";");
        var currentStripPos = currentPosition;
        for (var i = 0; i < paths.length; i++)
        {
            if (paths[i] == "!") {
                if (item.reset == "down")
                {
                    currentStripPos = {x: savedPos.x, y: savedPos.y + item.height};
                    savedPos.y = savedPos.y + item.height;
                }

                continue;
            }
            var first = paths[i].split(",")[0];
            var second = paths[i].split(",")[1];

            var newItem = {
                Position: {x: "", y: ""},
                SpawnType: item.SpawnType,
                width: item.width,
                height: item.height
            }
            if (item.DisableDynamicSpawning)newItem.DisableDynamicSpawning = true;
            switch (first)
            {
                case "l":
                    newItem.Position.x = "left";
                    break;
                case "r":
                    newItem.Position.x = "right";
                    break;
                case "s":
                    newItem.Position.x = "stay";
                    break;
            }
            switch (second)
            {
                case "u":
                    newItem.Position.y = "up";
                    break;
                case "d":
                    newItem.Position.y = "down";
                    break;
                case "s":
                    newItem.Position.y = "stay";
                break;
            }

            currentStripPos =  that.SpawnSingleItem(newItem, currentStripPos);


        }
        return currentStripPos;
    },
    Update: function()
    {
        var that = this;
        if(that.SpawnScaffold.length > 0)
        {
            for (var i = 0; i < that.SpawnScaffold.length; i++)
            {
                var item = that.SpawnScaffold[i];
                var viewRect = Game.Viewport.GetViewRectangle();
                if (!item.spawned && !item.dead && item.DisableDynamicSpawning)
                {
                    var spr = that.SpawnTypes[item.SpawnType](item.Position, item, item.addData);
                    item.Sprite = spr;
                    item.spawned = true;
                    spr.spawnItem = item;
                    spr.DrawParams = {tint: "green"};
                }
                else if (!item.spawned && !item.dead && viewRect.Intersects( {x: item.Position.x, y: item.Position.y, width: 10, height: 10} ) )
                {
                    if (item.SpawnType)
                    {
                        var spr = that.SpawnTypes[item.SpawnType](item.Position, item, item.addData);
                        item.Sprite = spr;
                        item.spawned = true;
                        spr.spawnItem = item;
                    }
                }
                if (item.spawned && item.Sprite && item.Sprite.Rectangle && !viewRect.Intersects( {x: item.Sprite.Rectangle.x, y: item.Sprite.Rectangle.y, width: item.Sprite.Rectangle.width, height: item.Sprite.Rectangle.height} ) )
                {
                    item.Sprite.Trash();
                    item.Sprite = null;
                    item.spawned = false;
                }

            }
        }
    }
}
