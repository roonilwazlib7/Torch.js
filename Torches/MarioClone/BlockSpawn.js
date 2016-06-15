/*
    Info On Spawning:

    All spawn items will be added when position is within camera
    and all spawn items will be removed when position is outside camera
    unless the 'DisableDynamicSpawning' attribute of the spawn item is
    set to true
*/

var BlockSpawn =
{
    startPoint: {x:-16,y:400},
    Items: [
        {
            SpawnType: "BasicBlock",
            Strip: true,
            StoreStripPattern: "solid-mass",
            Position: {x: "right", y: "up"},
            StripPath: "r,s;r,s;r,s;r,s;r,s;r,s;r,s;r,s;r,s;r,s;!;", //10 bricks, 32 * 10
            reset: "down",
            width: 32,
            height: 16,
            copies: 2
        },
        {
            PositionSet: {x: 304, y: 400}
        },
        /*
        {
            SpawnType: "QuestionBlock",
            Position: {x:"right", y: "up"},
            width: 16,
            height: 16
        },
        ,
        {
            SpawnType: "BasicBlock",
            Position: {x: 2000, y: 50},
            width: 16,
            height: 16,
            DisableDynamicSpawning: true
        },
        {
            PositionSet: {x: 400, y:400}
        },*/
        {
            SpawnType: "BasicBlock",
            Strip: true,
            StripPattern: "solid-mass"
        },
        {
            PositionSet: {x: 624, y: 400}
        },
        {
            SpawnType: "BasicBlock",
            Strip: true,
            StripPattern: "solid-mass"
        },
        {
            Position: {x: 750, y: 336}
        },
        {
            SpawnType: "Pipe",
            Position: {x: "right", y: "down"},
            width: 32,
            height: 32
        },
        {
            Position: {x: 400, y: 300}
        },
        /*{
            SpawnType: "BasicBlock",
            Strip: true,
            StoreStripPattern: "th",
            Position: {x: "right", y: "up"},
            StripPath: "r,s;r,s;r,s;", //10 bricks, 32 * 10
            reset: "down",
            width: 32,
            height: 16,
            copies: 2
        },*/
        {
            PositionSet: {x: 400, y: 400}
        },
        {
            SpawnType: "BasicBlock",
            Strip: true,
            Position: {x:"right", y:"down"},
            StripPath: "s,u;s,u;s,u;s,u;s,u;s,u",
            width: 32,
            height: 16
        },
        {
            SpawnType: "Goomba",
            Position: {x: "right", y: "up"},
            width: 16,
            height: 16
        },
        {
            PositionSet: {x: 600, y:100}
        },
        {
            SpawnType: "Goomba",
            Position: {x: "right", y: "up"},
            width: 16,
            height: 16
        },
        {
            PositionSet: {x: 700, y: 150}
        }
    ]
}

var TestSpawn = {
    startPoint: {x:-16,y:400},
    Items: [{"SpawnType":"BasicBlock","Position":{"x":0,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":32,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":64,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":96,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":128,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":160,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":192,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":224,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":256,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":288,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":320,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":352,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":384,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":416,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":448,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":480,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":512,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":544,"y":480},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":544,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":512,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":480,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":448,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":416,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":384,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":352,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":320,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":288,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":256,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":224,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":192,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":160,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":128,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":96,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":64,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":32,"y":464},"width":32,"height":16},{"SpawnType":"BasicBlock","Position":{"x":0,"y":464},"width":32,"height":16},{"SpawnType":"Hill","Position":{"x":128,"y":432},"width":74,"height":32},{"SpawnType":"Bush","Position":{"x":320,"y":448},"width":32,"height":16},{"SpawnType":"Pipe","Position":{"x":416,"y":432},"width":32,"height":32},{"SpawnType":"MysteryBlock","Position":{"x":128,"y":384},"width":16,"height":16},{"SpawnType":"MysteryBlock","Position":{"x":192,"y":384},"width":16,"height":16},{"SpawnType":"MysteryBlock","Position":{"x":224,"y":384},"width":16,"height":16},{"SpawnType":"BasicBrick","Position":{"x":240,"y":384},"width":16,"height":16},{"SpawnType":"BasicBrick","Position":{"x":208,"y":384},"width":16,"height":16},{"SpawnType":"BasicBrick","Position":{"x":176,"y":384},"width":16,"height":16},{"SpawnType":"MysteryBlock","Position":{"x":208,"y":304},"width":16,"height":16,"args":{"coin":true}},{"SpawnType":"Cloud","Position":{"x":96,"y":240},"width":32,"height":24},{"SpawnType":"Cloud","Position":{"x":320,"y":272},"width":32,"height":24},{"SpawnType":"Cloud","Position":{"x":352,"y":272},"width":32,"height":24},{"SpawnType":"Cloud","Position":{"x":384,"y":272},"width":32,"height":24},{"SpawnType":"Goomba","Position":{"x":368,"y":448},"width":16,"height":16}]
}
