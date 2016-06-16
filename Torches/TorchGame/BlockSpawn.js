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
    Items: [{"SpawnType":"StoneBlock","Position":{"x":0,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":64,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":128,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":192,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":256,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":320,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":384,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":448,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":512,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":576,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":640,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":704,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":768,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":832,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":896,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":960,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1024,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1088,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1152,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1216,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1216,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1152,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1088,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1024,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":960,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":896,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":768,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":832,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":704,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":640,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":576,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":512,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":448,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":384,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":320,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":256,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":192,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":128,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":64,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":0,"y":576},"width":64,"height":64},{"SpawnType":"Mountain","Position":{"x":384,"y":320},"width":256,"height":256},{"SpawnType":"Mountain","Position":{"x":576,"y":320},"width":256,"height":256},{"SpawnType":"Mountain","Position":{"x":704,"y":320},"width":256,"height":256},{"SpawnType":"Mountain","Position":{"x":192,"y":320},"width":256,"height":256},{"SpawnType":"Mountain","Position":{"x":896,"y":320},"width":256,"height":256},{"SpawnType":"Mountain","Position":{"x":832,"y":320},"width":256,"height":256},{"SpawnType":"Mountain","Position":{"x":0,"y":320},"width":256,"height":256}]
}
