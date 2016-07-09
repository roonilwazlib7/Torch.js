function Assert(condition, tag)
{
    if (!condition) {
        Torch.Message("Test: " + tag + " Failed", "red");
        $("canvas").remove();
        Torch = null;
        throw "Test: " + tag + " Failed";
    }
    else Torch.Message("Test: " + tag + " Passed", "green");
}

function PlayerTests()
{
    function TestPlayerHealthLowersWhenHit()
    {
        var p = new Player();
        var oldHealth = p.Health;
        p.Hit();
        Assert(p.Health < oldHealth, "TestPlayerHealthLowersWhenHit");
    }
    function TestPlayerDiesWhenHealthDepleted()
    {
        var p = new Player();
        p.Hit(100);
        Assert(p.isDead, "TestPlayerDiesWhenHealthDepleted" );
    }
    function TestPlayerLosesHealthWhenEnemyTouches()
    {
        var p = new Player();
        var oldHealth = p.Health;
        p.EnemyCollision();
        Assert(p.Health < oldHealth, "TestPlayerLosesHealthWhenEnemyTouches" );
    }
    TestPlayerHealthLowersWhenHit();
    TestPlayerDiesWhenHealthDepleted();
    //TestPlayerLosesHealthWhenEnemyTouches();
}
function Tests()
{
    PlayerTests();
}
function TestGameInit()
{
    function TestBouncyEye()
    {
        var bouncyEye = new BouncyEye({x:350, y:50});
        bouncyEye.ManualSpawn();
    }
    TestBouncyEye();
}
function TestsUpdate()
{
    if (Game.Keys.M.down) Game.Player.Health -= 0.1;
}
