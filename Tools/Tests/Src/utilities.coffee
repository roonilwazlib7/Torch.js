test = require("unit.js")
torchTest = require("./torch-test.js")
Torch = require("../../../Builds/torch-latest.js").Torch
T = Torch.Util
tests = []

tests.push ->
    # test Util.Array.All
    arrayBefore = [1,1,1]
    total = 0

    T.Array(arrayBefore).All (item) ->
        total += item

    test.assert( total is 3 )

tests.push ->
    # test Util.Array.Find
    foundItem = T.Array( [1,2,null,'l',false,"50","f"] ).Find (item) ->
        return item is "50"

    test.assert( foundItem is "50" )

tests.push ->
    # test Util.Array.Filter
    arrayHasEvens = T.Array( [1,2,3] ).Filter (item) ->
        return item % 2 is 0

    arrayHasObjectsWithProp = T.Array( [ {x: 0, y: 0}, {x: 1, y: 1} ] ).Filter (item) ->
        return item.x is 1

    test.assert( arrayHasEvens.length is 1 )
    test.assert( arrayHasEvens[0] is 2 )
    test.assert( arrayHasObjectsWithProp.length is 1 )

tests.push ->
    arrayShouldntHaveEvens = T.Array( 1,2,3 )

module.exports = ->
    torchTest.RunTests(tests, __filename)
