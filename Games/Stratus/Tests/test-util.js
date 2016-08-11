function RunTests(test, assert)
{
    var obj = new test();
    for (key in test.prototype)
    {
        if (typeof obj[key] == "function")
        {
            obj[key](assert);
        }
    }
}
