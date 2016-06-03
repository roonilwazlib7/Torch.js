/*
    Info On Spawning:

    All spawn items will be added when position is within camera
    and all spawn items will be removed when position is outside camera
    unless the 'DisableDynamicSpawning' attribute of the spawn item is
    set to true
*/

var BlockSpawn =
{
    startPoint: {x:0,y:400},
    Items: [
        /*{
            SpawnType: "BasicBlock",
            Position: {x: "right", y: "down"},
            width: 16,
            height: 16
        },*/
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
            PositionSet: {x: 320, y: 400}
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
            ItemType: "BasicBlock",
            Strip: true,
            StripPattern: "solid-mass"
        },
        {
            PositionSet: {x: 640, y: 400}
        },
        {
            ItemType: "BasicBlock",
            Strip: true,
            StripPattern: "solid-mass"
        }
    ]
}
