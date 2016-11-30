class KeyPipe

    constructor: (@game) ->
        @text = ""
        @listening = false
        @game.Keys.On "KeyPress", (event) =>
            if event.keyText is "delete"
                @text = @text.substring(0, -1)
            else if @listening
                @text += event.keyText
