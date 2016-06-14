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
            width: 64,
            height: 64,
            copies: 2
        },
        {
            PositionSet: {x: 800, y: 400}
        },
        {
            SpawnType: "BasicBlock",
            Strip: true,
            StripPattern: "solid-mass",
            width: 64,
            height: 64
        }
    ]
}
