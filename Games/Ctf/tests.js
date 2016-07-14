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

function RunTests()
{
    RunCoreGameTests();
}
function RunInitTests()
{
    
}
