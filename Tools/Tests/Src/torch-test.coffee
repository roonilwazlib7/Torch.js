module.exports =
    RunTests: (tests, fileName) ->
        try
            for t in tests then t()
        catch e
            console.log("===TESTS FAILED===\n===#{fileName}===\n")
            throw e
        finally
            console.log("===TESTS PASSED===\n#{fileName}\n#{tests.length} passed")
