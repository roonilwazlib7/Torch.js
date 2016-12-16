exports = this


Enum = (parts...) ->
    obj = {}

    for part,i in parts
        obj[part] = i+1

    return obj

class MathUtility
    constructor: ->

    RandomInRange: (min,max) ->
        return Math.random() * (max - min + 1) + min

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

    @GamePads: Enum("Pad1", "Pad2", "Pad3", "Pad4")
    @AjaxData: Enum("DOMString", "ArrayBuffer", "Blob", "Document", "Json", "Text")
    @Types: Enum("String", "Number", "Object", "Array", "Function", "Sprite", "Game", "Null")
    @Easing: Enum("Linear", "Square", "Cube", "InverseSquare", "InverseCube", "Smooth", "SmoothSquare", "SmoothCube", "Sine", "InverseSine")

    @AjaxLoader: AjaxLoader
    @Event: Event
    @Util: new Utilities() # a static reference for use within torch

    constructor: ->
        @GamePads = Enum("Pad1", "Pad2", "Pad3", "Pad4")
        @AjaxData = Enum("DOMString", "ArrayBuffer", "Blob", "Document", "Json", "Text")
        @Types = Enum("String", "Number", "Object", "Array", "Function", "Sprite", "Game", "Null")
        @Easing = Enum("Linear", "Square", "Cube", "InverseSquare", "InverseCube", "Smooth", "SmoothSquare", "SmoothCube", "Sine", "InverseSine")

        @Event = Event
        @EventDispatcher = EventDispatcher
        @Trashable = Trashable

        @Util = new Utilities()

        # all the modules we want exposed
        @Color = Color
        @DebugConsole = DebugConsole
        @StateMachine = StateMachine
        @Rectangle = Rectangle
        @Vector = Vector
        @Point = Point
        @Game = Game
        @Sprite = Sprite
        @SpriteGrid = SpriteGrid
        @SpriteGroup = SpriteGroup
        @Text = Text
        @Electron = new Electron()

    @FatalError: (error) ->
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

exports.Torch = new Torch()
