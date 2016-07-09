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

function RunCoreGameTests()
{
    Assert(Torch != null, "Torch object exists");
    Assert(Torch.Game != null, "Torch.Game object exists");
}

function RunParticleTests()
{
    function Burst()
    {
        var burst = new Torch.ParticleEmitter(300,300, 3000, 500);
        burst.CreateBurstEmitter(Particles.Blood, 25, 0.5, 0.5, 0.1, 0.1);
        burst.Body.x.velocity = 0.05;
    }
    function Slash()
    {
        var slash = new Torch.ParticleEmitter(300, 400, 3000, 500);
        slash.CreateSlashEmitter(Particles.Blood, 25, 2, 1.5, {x: 0, y: 0}, {x:15,y:15} );
    }
    try
    {
        Burst();
        Slash();
    }
    catch (e)
    {
        console.log(e);
        Assert(false, "Particles");
    }
}

function RunTests()
{
    RunCoreGameTests();
}
function RunInitTests()
{
    RunParticleTests();
}
