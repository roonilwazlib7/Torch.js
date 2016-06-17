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
    Items: [{"SpawnType":"StoneBlock","Position":{"x":-500,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-436,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-372,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-308,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-244,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-180,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-116,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-52,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":12,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":76,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":140,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":204,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":268,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":332,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":396,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":460,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":524,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":588,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":652,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":716,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":780,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":844,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":908,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":972,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1036,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1164,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1100,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1228,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1292,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1356,"y":640},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1356,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1292,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1228,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1164,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1100,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":1036,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":972,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":908,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":844,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":780,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":716,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":652,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":588,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":524,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":460,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":396,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":332,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":268,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":204,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":140,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":76,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":12,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-52,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-116,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-180,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-244,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-308,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-372,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-436,"y":576},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-500,"y":576},"width":64,"height":64},{"SpawnType":"Mountain","Position":{"x":-436,"y":320},"width":256,"height":256},{"SpawnType":"Mountain","Position":{"x":-180,"y":320},"width":256,"height":256},{"SpawnType":"Mountain","Position":{"x":204,"y":320},"width":256,"height":256},{"SpawnType":"Mountain","Position":{"x":460,"y":320},"width":256,"height":256},{"SpawnType":"Mountain","Position":{"x":844,"y":320},"width":256,"height":256},{"SpawnType":"Mountain","Position":{"x":1164,"y":320},"width":256,"height":256},{"SpawnType":"GrassBlock","Position":{"x":780,"y":448},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":844,"y":448},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":844,"y":384},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":908,"y":384},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":908,"y":448},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":972,"y":320},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":972,"y":384},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":972,"y":448},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":1036,"y":448},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":1036,"y":384},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":1036,"y":320},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":1100,"y":320},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":1100,"y":384},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":1100,"y":448},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":1164,"y":448},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":1164,"y":384},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":1164,"y":320},"width":64,"height":64},{"SpawnType":"Tree","Position":{"x":1100,"y":192},"width":128,"height":128},{"SpawnType":"Tree","Position":{"x":844,"y":256},"width":128,"height":128}]
}
