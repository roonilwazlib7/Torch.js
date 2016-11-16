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

    constructor: (url, responseType = Torch.AjaxData.DOMString) ->
        @url = url
        @responseType = @GetResponseTypeString(responseType)

    GetResponseTypeString: (responseType) ->
        switch responseType
            when Torch.AjaxData.DOMString then      return ""
            when Torch.AjaxData.ArrayBuffer then    return "arraybuffer"
            when Torch.AjaxData.Blob then           return "blob"
            when Torch.AjaxData.Document then       return "document"
            when Torch.AjaxData.Json then           return "json"
            when Torch.AjaxData.Text then           return "text"

    Error: (func) -> onError = func

    Finish: (func) -> onFinish = func

    Load: ->
        request = new XMLHttpRequest()
        request.open('GET', url, true)
        request.responseType = @responseType

        request.onload = =>
            @onFinish(request.response)

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

    constructor: ->
        @GamePads = @Enum("Pad1", "Pad2", "Pad3", "Pad4")
        @AjaxData = @Enum("DOMString", "ArrayBuffer", "Blob", "Document", "Json", "Text")
        @AjaxLoader = AjaxLoader
        @Event = Event
        @EventDispatcher = EventDispatcher
        @Trashable = Trashable

    Needs: (key) ->
        # make sure we have the peoper torch components
        if not Torch[key] then throw "Compenent #{key} is required"
        return @

    Message: (message, color) ->
        if $("#torch_message").length > 0
            message = $("<p>" + message + "</p>")
            message.css("font-weight", "bold")

            if color then message.css("color", color)

            $("#torch_message").append(message)

    FatalError: (error) ->
        return if @fatal
        @fatal = true

        if typeof error is "string"
            error = new Error(error)

        document.body.backgroundColor = "black"
        stack = error.stack.replace(/\n/g, "<br><br>")

        errorHtml = """
        <code style='color:#C9302C;margin-left:15%;font-size:24px'>#{error}</code>
        <br>
        <code style='color:#C9302C;font-size:20px;font-weight:bold'>Stack Trace:</code><br>
        <code style='color:#C9302C;font-size:20px'>#{stack}</code><br>
        """
        $("body").empty()
        $("body").prepend(errorHtml)
        throw error

    StrictErrors: ->
        @STRICT_ERRORS = true

    Enum: (parts...) ->
        obj = {}

        for part,i in parts
            obj[part] = i+1

        return obj

    ExtendProperties: (Class, properties...) ->
        for prop in properties
            keyProp = prop.unCapitalize()
            func = (arg) ->
                return @[keyProp] if arg is undefined
                @[keyProp] = arg
                return @
            Class.prototype[prop] = func

exports.Torch = new Torch()
