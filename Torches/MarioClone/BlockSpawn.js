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
        },
        {
            SpawnType: "Goomba",
            Position: {x: "right", y: "up"},
            width: 16,
            height: 16
        }
    ]
}
