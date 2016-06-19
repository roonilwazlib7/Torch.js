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
var TestingWorld = {
    Room2: {
        startPoint: {x:-16,y:400},
        Items: [{"SpawnType":"StoneBlock","Position":{"x":-500,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-436,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-372,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-308,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-244,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-180,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-116,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-52,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-52,"y":256},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-116,"y":256},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-180,"y":256},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-244,"y":256},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-308,"y":256},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-372,"y":256},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-436,"y":256},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-436,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-372,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-308,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-244,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-180,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-116,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-52,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-52,"y":128},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-116,"y":128},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-180,"y":128},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-244,"y":128},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-308,"y":128},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-372,"y":128},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":-436,"y":128},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":12,"y":128},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":12,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":12,"y":256},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":12,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":76,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":140,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":204,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":268,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":332,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":396,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":460,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":588,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":524,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":652,"y":448},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":652,"y":384},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":652,"y":320},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":652,"y":256},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":652,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":588,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":524,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":460,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":396,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":332,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":268,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":204,"y":192},"width":64,"height":64},{"SpawnType":"StoneBlock","Position":{"x":140,"y":192},"width":64,"height":64},{"SpawnType":"DayDoor","Position":{"x":524,"y":384},"width":64,"height":64,"addData":{"Room":"Room2"}},{"SpawnType":"GrassBlock","Position":{"x":652,"y":128},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":588,"y":128},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":524,"y":128},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":460,"y":128},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":396,"y":128},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":332,"y":128},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":268,"y":128},"width":64,"height":64},{"SpawnType":"GrassBlock","Position":{"x":204,"y":128},"width":64,"height":64},{"SpawnType":"Tree","Position":{"x":588,"y":0},"width":128,"height":128},{"SpawnType":"Tree","Position":{"x":460,"y":0},"width":128,"height":128},{"SpawnType":"Tree","Position":{"x":332,"y":0},"width":128,"height":128},{"SpawnType":"Tree","Position":{"x":204,"y":0},"width":128,"height":128}]
    },
    Room1:{
        startPoint: {x:-16,y:400},
        Items:[
    {
        "SpawnType": "WaterTop",
        "Position": {
            "x": -500,
            "y": 192
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterTop",
        "Position": {
            "x": -436,
            "y": 192
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterTop",
        "Position": {
            "x": -372,
            "y": 192
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterTop",
        "Position": {
            "x": -308,
            "y": 192
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterTop",
        "Position": {
            "x": -244,
            "y": 192
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterTop",
        "Position": {
            "x": -180,
            "y": 192
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterTop",
        "Position": {
            "x": -116,
            "y": 192
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterTop",
        "Position": {
            "x": -52,
            "y": 192
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterTop",
        "Position": {
            "x": 12,
            "y": 192
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterTop",
        "Position": {
            "x": 76,
            "y": 192
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterTop",
        "Position": {
            "x": 140,
            "y": 192
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": 140,
            "y": 256
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": 76,
            "y": 256
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": 12,
            "y": 256
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -52,
            "y": 256
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -116,
            "y": 256
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -180,
            "y": 256
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -244,
            "y": 256
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -308,
            "y": 256
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -372,
            "y": 256
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -436,
            "y": 256
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -500,
            "y": 256
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -500,
            "y": 320
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -436,
            "y": 320
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -372,
            "y": 320
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -308,
            "y": 320
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -244,
            "y": 320
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -180,
            "y": 320
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -116,
            "y": 320
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -52,
            "y": 320
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": 12,
            "y": 320
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": 76,
            "y": 320
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": 140,
            "y": 320
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": 140,
            "y": 384
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": 76,
            "y": 384
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": 12,
            "y": 384
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -52,
            "y": 384
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -116,
            "y": 384
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -180,
            "y": 384
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -244,
            "y": 384
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -308,
            "y": 384
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -372,
            "y": 384
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -436,
            "y": 384
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "WaterMain",
        "Position": {
            "x": -500,
            "y": 384
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": -500,
            "y": 448
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": -436,
            "y": 448
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": -372,
            "y": 448
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": -308,
            "y": 448
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": -244,
            "y": 448
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": -180,
            "y": 448
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": -116,
            "y": 448
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": -52,
            "y": 448
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": 12,
            "y": 448
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": 76,
            "y": 448
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": 140,
            "y": 448
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": 204,
            "y": 448
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": 204,
            "y": 384
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": 204,
            "y": 192
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": 204,
            "y": 256
        },
        "width": 64,
        "height": 64
    },
    {
        "SpawnType": "StoneBlock",
        "Position": {
            "x": 204,
            "y": 320
        },
        "width": 64,
        "height": 64
    }
]
    }
}
