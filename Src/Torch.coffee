exports = this

# Catch all errors
window.onerror = (args...) ->
    return if not window.Torch.STRICT_ERRORS

    errorObj = args[4]

    if errorObj isnt undefined
        window.Torch.FatalError(errorObj)
    else
        window.Torch.FatalError("An error has occured")

class Task

    Task.MixIn(Trashable)

    _torch_add: "Task"
    constructor: (@func) ->

    Execute: (game) ->
        @func(game)

class AjaxLoader
    onFinish: ->
    onError: ->

    constructor: (url, responseType = window.Torch.AjaxData.Text) ->
        @url = url
        @responseType = @GetResponseTypeString(responseType)

    GetResponseTypeString: (responseType) ->
        switch responseType
            when window.Torch.AjaxData.DOMString then      return ""
            when window.Torch.AjaxData.ArrayBuffer then    return "arraybuffer"
            when window.Torch.AjaxData.Blob then           return "blob"
            when window.Torch.AjaxData.Document then       return "document"
            when window.Torch.AjaxData.Json then           return "json"
            when window.Torch.AjaxData.Text then           return "text"

    Error: (func) -> @onError = func

    Finish: (func) -> @onFinish = func

    Load: ->
        request = new XMLHttpRequest()
        request.open('GET', @url, true)
        request.responseType = @responseType

        request.onload = =>
            @onFinish(request.response, @)

        request.send()

class Event
    constructor: (@game, @data) ->
        if @game isnt null
            @time = @game.time
        for key,value of @data
            @[key] = value

class Torch

    CANVAS: 1
    WEBGL: 2
    PIXEL: 3

    DUMP_ERRORS: false

    constructor: ->
        @GamePads = @Enum("Pad1", "Pad2", "Pad3", "Pad4")
        @AjaxData = @Enum("DOMString", "ArrayBuffer", "Blob", "Document", "Json", "Text")
        @Types = @Enum("String", "Number", "Object", "Array", "Function", "Sprite", "Game", "Null")
        @AjaxLoader = AjaxLoader
        @Event = Event
        @EventDispatcher = EventDispatcher
        @Trashable = Trashable
        @Util = new Utilities()

    RandomInRange: (min, max) ->
        return Math.random() * (max - min + 1) + min

    Needs: (key) ->
        # make sure we have the peoper torch components
        if not Torch[key] then throw "Compenent #{key} is required"
        return @

    FatalError: (error) ->
        return if @fatal
        @fatal = true

        if typeof error is "string"
            error = new Error(error)

        document.body.backgroundColor = "black"

        if @DUMP_ERRORS
            if require isnt undefined
                require("fs").writeFileSync("torch-error.log", error.stack)

        stack = error.stack.replace(/\n/g, "<br><br>")

        errorHtml = """
        <code style='color:#C9302C;margin-left:15%;font-size:24px'>#{error}</code>
        <br>
        <code style='color:#C9302C;font-size:20px;font-weight:bold'>Stack Trace:</code><br>
        <code style='color:#C9302C;font-size:20px'>#{stack}</code><br>
        """
        document.body.innerHTML = errorHtml
        throw error

    StrictErrors: ->
        @STRICT_ERRORS = true

    DumpErrors: ->
        @DUMP_ERRORS = true

    DisableConsoleWarnings: ->
        console.warn = ->

    Enum: (parts...) ->
        obj = {}

        for part,i in parts
            obj[part] = i+1

        return obj

    Assert: (expression, errorTag = "Assertation Failed") ->
        if not expression
            Torch.FatalError(errorTag)

    TypeOf: (obj) ->

        objTypes = []

        objTypes.push(obj.__torch__) if obj.__torch__ isnt undefined


        typeString = ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()

        switch typeString
            when "string"
                objTypes.push(Torch.Types.String)
            when "number"
                objTypes.push(Torch.Types.Number)
            when "object"
                objTypes.push(Torch.Types.Object)
            when "array"
                objTypes.push(Torch.Types.Array)
            when "function"
                objTypes.push(Torch.Types.Function)
            else
                objTypes.push(Torch.Types.Null)

        return objTypes

    Is = (obj, torchType) ->
        return Torch.TypeOf(obj).indexOf(torchType) isnt -1

    ExtendObject: (objectToExtend, newObject) ->
        for key,value of newObject
            objectToExtend[key] = value

    ExtendProperties: (Class, properties...) ->
        for prop in properties
            keyProp = prop.unCapitalize()
            func = (arg) ->
                return @[keyProp] if arg is undefined
                @[keyProp] = arg
                return @
            Class.prototype[prop] = func

class Utilities
    Expose: ->
        window["T"] = @

    RandomInRange: ->

    String: (str) ->
        return new StringUtility(str)

    Array: (array) ->
        return new ArrayUtility(array)

    Function: (func) ->
        return new FunctionUtility(func)

    Object: (obj) ->
        return new ObjectUtility(obj)


class StringUtility
    constructor: (@str) ->

    String: ->
        return @str

    Chunk: (chunkLength) ->
        @str = @str.match(new RegExp('.{1,' + chunkLength + '}', 'g'));
        return @str

    Capitalize: ->
        @str[0] = @str[0].toUpperCase()
        return @str

class ArrayUtility
    constructor: (@array) ->

    Array: ->
        return @array

    All: (applier) ->
        for item in @array
            applier(item)

    Find: (selector) ->
        for item in @array
            return item if selector(item)

    Filter: (selector) ->
        selectedItems = []
        for item in @array
            selectedItems.push(item) if selector(item)
        return selectedItems

    Reject: (selector) ->
        selectedItems = []
        for item in @array
            selectedItems.push(item) if not selector(item)
        return selectedItems

    Where: (properties) ->
        items = @Filter (item) ->
            for key,value of properties
                if item[key] isnt value
                    return false
            return true

        return items

    Every: (selector) ->
        for item in @array
            return false if not selector(item)

        return true

    Some: (selector) ->
        for item in @array
            return true if selector(item)

        return false

    Contains: (item, startIndex = 0) ->
        index = @array.indexOf(item)
        return ( index isnt -1 and index >= startIndex )

    Pluck: (propertyName) ->
        properties = []

        for item in @array
            properties.push( item[propertyName] )

        return properties

    Max: (selector) ->
        currentMax = 0
        if not selector?
            selector = (item) -> return item

        for item in @array
            compareValue = selector(item)
            if compareValue > currentMax
                currentMax = item

        return currentMax

    Min: (selector) ->
        currentMin = 0
        if not selector?
            selector = (item) -> return item

        for item in @array
            compareValue = selector(item)
            if compareValue < currentMin
                currentMin = compareValue

        return currentMin

    SortBy: (sorter) ->

    GroupBy: (grouper) ->
        if not grouper?
            grouper = (item) -> return item.toString().length

        groups = {}

        for item in @array
            group = grouper(item)

            if not groups[group]?
                groups[group] = [ item ]
            else
                groups[group].push(item)

        return groups

    CountBy: (grouper) ->
        groups = @GroupBy(grouper)

        for key,value of groups
            groups[key] = value.length

        return groups

    Shuffle: ->
        currentIndex = @array.length
        temporaryValue = currentIndex
        randomIndex = currentIndex

        #While there remain elements to shuffle...
        while 0 isnt currentIndex

            #Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1

            #And swap it with the current element.
            temporaryValue = @array[currentIndex]
            @array[currentIndex] = @array[randomIndex]
            @array[randomIndex] = temporaryValue

        return @array

    Sample: (n = 1) ->
        sample = []
        while n > 0
            n--
            # needs work

    Partition: (checker) ->
        return [ @Filter(checker), @Reject(checker) ]

    First: (n = 1) ->
        return @array[0] if n is 1

        items = []
        while n <= @array.length
            items.push( @array[ n - 1 ] )
            n++

        return items

    Last: (n = 1) ->
        return @array[ @array.length - 1 ] if n is 1

        items = []
        while n <= @array.length
            items.push( @array[ @array.length - (n - 1) ] )
            n++

        return items

    Flatten: ->
        # reduce 'list of lists' down to one list

    Without: (values...) ->
        filteredItems = []

        for item in @array
            filteredItems.push( item ) if values.indexOf(item) is -1

        return filteredItems

    Union: (arrays...) ->
        ars = [@array, arrays...]
        combinedArray = []

        for ar in ars
            for item in ar
                combinedArray.push(item) if combinedArray.indexOf(item) is -1

        return combinedArray

    Intersection: (arrays...) ->
        ars = [@array, arrays...]
        combinedArray = []
        index = {}

        for ar in ars
            for item in ar
                if not index[item]?
                    index[item] = 1
                else
                    index[item] += 1

        for key,value of index
            if value >= arrays.length
                combinedArray.push(key)

        return combinedArray

    Uniq: ->
        # reduce array to unique values

    Zip: (arrays...) ->
        combinedArray = []

        for item,index in @array
            piece = [ item ]

            for ar in arrays
                piece.push( ar[index] )

            combinedArray.push(piece)

        return combinedArray

    UnZip: (arrays...) ->
        # opposite of Zip...

class FunctionUtility
    constructor: (@func) ->

    Defer: (args...) ->
        f = =>
            @func(args...)
        setTimeout(f , 0)

    Once: ->
        oldFunc = @func
        newFunc = (args...) ->
            return if this.called

            oldFunc(args...)
            this.called = true

        return newFunc

    After: (timesBeforeExecuted) ->
        oldFunc = @func
        newFunc = (args...) ->
            this.timesBeforeExecuted += 1
            return if this.calledCount < timesBeforeExecuted

            oldFunc(args...)
            this.called = true

        newFunc.timesBeforeExecuted = 0

        return newFunc

    Before: (timesExecuted) ->
        oldFunc = @func
        newFunc = (args...) ->
            this.timesExecuted += 1
            return if this.calledCount > timesExecuted

            oldFunc(args...)
            this.called = true

        newFunc.timesExecuted = 0

        return newFunc

    Compose: (funcs...) ->
        allFuncs = [@func, funcs...]

        i = 0

        newFunc = ->
            lastReturn = undefined

            while i < allFuncs.length
                lastReturn = allFuncs[i](lastReturn)
                i++

        return newFunc

class ObjectUtility
    constructor: (@obj) ->

    Keys: ->
        keys = []

        for key,value of @obj
            keys.push(key)

        return keys

    Values: ->
        values = []

        for key,value of @obj
            values.push(value)

        return values

    All: (applier) ->
        for key,value of @obj
            @obj[key] = applier(key,value)

        return @obj

    Invert: ->
        newObj = {}
        for key,value of @obj
            newObj[value] = key

        return newObj

    Functions: ->
        functionList = []

        for key,value of @obj
            functionList.push( value.name ) if typeof(value) is "function"

        return functionList

    Extend: (objects...)->
        for obj in objects

            for key,value of obj
                @obj[key] = value

        return @obj

    Pick: (pickKeys...) ->
        newObj = {}

        if typeof(pickKeys) is "function"
            for key,value of @obj
                newObj[key] = value if pickKeys(key, value, @obj)

        else
            for key in pickKeys
                newObj[key] = @obj[key]

        return newObj

    Omit: (omitKeys...) ->
        newObj = {}

        if typeof(omitKeys) is "function"
            for key,value of @obj
                newObj[key] = value if not omitKeys(key, value, @obj)

        else
            for key,value of @obj
                newObj[key] = @obj[key] if omitKeys.indexOf(key) is -1

        return newObj

    Clone: ->
        #... a good clone

    Has: (key) ->
        return false if not @obj[key]?
        return true

    Matches: (otherObj) ->
        for key,value of otherObj
            return false if @obj[key] isnt value

        return true

    Empty: ->
        return @Keys().length is 0



exports.Torch = new Torch()
