class Loop
    constructor: (@game) ->
        @fps = 60

    RunGame: ->
        @game.draw(@)
        @game.update(@)

        @game.Camera.Update()
        @game.Timer.Update()
        
        @game.UpdateAndDrawSprites()
        @game.UpdateAnimations()
        @game.UpdateTimeInfo()
        @game.UpdateTasks()
        @game.UpdateGamePads()

    AdvanceFrame: (timestamp) ->
        if @game.time is undefined
            @game.time = timestamp

        @game.deltaTime = Math.round(timestamp - @game.time)
        @game.time = timestamp

        @RunGame()

        window.requestAnimationFrame (timestamp) =>
            @AdvanceFrame(timestamp)

    Run: (timestamp) ->
        @AdvanceFrame(0)

Torch.Loop = Loop
