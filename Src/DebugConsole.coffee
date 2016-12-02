class DebugConsole
    enabled: false
    console: null
    consoleInput: null
    consoleOutput: null
    commands: null
    variables: null
    constructor: (@game) ->
        html = """
                <div id = "torch-console" style = "position: absolute;z-index: 100;top:0;border: 1px solid orange;background-color:black">
                    <p style = "color:white;margin-left:1%;font-family:monospace">Torch Dev Console. Type /HELP for usage</p>
                    <input type="text" id = "torch-console-input" placeholder="Torch Dev Console, type /HELP for usage"/ style = "outline: none;border: none;font-family: monospace;color: white;background-color: black;font-size: 16px;padding: 3%;width: 100%;" />
                    <div id = "torch-console-output" style = "overflow:auto;outline: none;border: none;font-family: monospace;color: white;background-color: black;font-size: 14px;padding: 1%;width: 98%;height:250px"></div>
                </div>
        """
        div = document.createElement("div")

        div.innerHTML = html
        div.style.display = "none"

        document.body.appendChild(div)

        @console = div
        @consoleInput = document.getElementById("torch-console-input")
        @consoleOutput = document.getElementById("torch-console-output")
        @commands = {}
        @variables = {}

        @LoadDefaultCommands()

        document.addEventListener "keypress", (e) =>
            if e.keyCode is 47
                @Toggle(true)

            else if e.keyCode is 13
                @ParseCommand()

        document.addEventListener "keydown", (e) =>
            if e.keyCode is 27
                @Toggle(false)

    Toggle: (tog = true) ->

        if tog
            @console.style.display = "block"
            @consoleInput.focus()
            @enabled = true
        else
            @console.style.display = "none"
            @consoleInput.value = ""
            @enabled = false

    Output: (content, color = "white") ->
        content = content.replace(/\n/g, "<br>")
        @consoleOutput.innerHTML += "<p style='color:orange'>TorchDev$</p><p style='color:#{color}'>#{content}</p>"

    ParseCommand: ->
        return if not @enabled

        commandText = @consoleInput.value

        # put in environment vars
        commandText = commandText.replace /\$(.*?)\$/g, (text) =>
             clippedText = text.substring(1,text.length-1)
             return @variables[clippedText]

        command = commandText.split(" ")[0].split("/")[1]
        args = []

        for option,index in commandText.split(" ")
            args.push(option) if index isnt 0

        @ExecuteCommand(command, args)

    ExecuteCommand: (command, args) ->
        if not @commands[command]
            @Output("Command '#{command}' does not exist.", "red")
            return
        else
            @commands[command]( @, args... )

    AddCommand: (name, callback) ->
        @commands[name] = callback

    LoadDefaultCommands: ->
        @AddCommand "HELP", (tConsole) =>
            tConsole.Output """
            type '/HELP' for help
            type '/FPS' for frame rate
            type '/TIME' for game time
            type '/E [statement]' to execute a JavaScript statement
            type '/RUN [path] to load and execute a JavaScript file'
            """
        @AddCommand "CLEAR", (tConsole) =>
            @consoleOutput.innerHTML = ""
        @AddCommand "FPS", (tConsole) =>
            tConsole.Output """
            Current FPS: #{@game.fps}
            Average FPS: #{0}
            """
        @AddCommand "TIME", (tConsole) =>
            tConsole.Output """
            Total Game Time: #{@game.time}
            Delta Time: #{@game.deltaTime}
            """
        @AddCommand "RUN", (tConsole, filePath) =>
            loader = new Torch.AjaxLoader(filePath, Torch.AjaxData.Text)
            loader.Finish (data) =>
                try
                    eval(data)
                    tConsole.Output("File Executed", "green")
                catch error
                    tConsole.Output("File: '#{statement}' caused an error. #{error}", "red")

            loader.Load()

        @AddCommand "SET", (tConsole, name, value) =>
            if isNaN(value)
                @variables[name] = value
            else
                @variables[name] = parseFloat(value)

            @Output("Set #{name} to #{value}", "green")

        @AddCommand "E", (tConsole, statement) =>
            try
                eval(statement)
                tConsole.Output("Statment Executed", "green")
            catch error
                tConsole.Output("Statement: '#{statement}' caused an error. #{error}", "red")


Torch.DebugConsole = DebugConsole
