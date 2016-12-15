class Debug
    constructor: (@game) ->
        @text = ""
        @CreateHtmlDisplay()

    CreateHtmlDisplay: ->
        display = document.createElement("DIV")
        display.style.position = "absolute"
        display.style.display = "block"
        display.style.color = "white"
        display.style.font = "monospace"
        display.style.top = 0
        document.body.appendChild(display)
        @display = display

    Update: ->
        # @display.innerHTML = @text
        #
        # @text = @game.name + " Debug Info: <br />"
        # @text += "fps: "  + @game.fps
