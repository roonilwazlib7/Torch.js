/*
    Info On Spawning:

    All spawn items will be added when position is within camera
    and all spawn items will be removed when position is outside camera
    unless the 'DisableDynamicSpawning' attribute of the spawn item is
    set to true
*/

var BlockSpawn =
{
    startPoint: {x:150,y:150},
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
            StoreStripPattern: "stairs",
            Position: {x: "right", y: "up"},
            StripPath: "r,s;r,s;r,s;r,s;r,s;",
            width: 16,
            height: 16,
            copies: 10
        },
        {
            PositionSet: {x:150, y:100}
        },
        {
            SpawnType: "QuestionBlock",
            Position: {x:"right", y: "up"},
            width: 16,
            height: 16
        }
        /*,
        {
            SpawnType: "BasicBlock",
            Position: {x: 2000, y: 50},
            width: 16,
            height: 16,
            DisableDynamicSpawning: true
        },
        {
            PositionSet: {x: 400, y:400}
        },
        {
            ItemType: "BasicBlock",
            Strip: true,
            StripPattern: "stairs"
        }*/
    ]
}
