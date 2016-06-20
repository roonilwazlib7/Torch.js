function Tests()
{
    function Assert(condition, tag)
    {
        if (!condition) Torch.Message("Test: " + tag + " Failed");
        else Torch.Message("Test: " + tag + " Passed");
    }
    function TestBouncyEye()
    {
        var bouncyEye = new BouncyEye({x:50, y:50}); }

    TestBouncyEye();
}
