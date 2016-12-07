class Loop
    constructor: (@game) ->
        @fps = 60
        @frameTime = 1000/@fps
        @lag = 0
        @updateDelta = 0
        @drawDelta = 0
        @lagOffset
    Update: ->
        @game.update(@)

        @game.Camera.Update()
        @game.Timer.Update()
        @game.Debug.Update()

        @game.UpdateAnimations()
        @game.UpdateTimeInfo()
        @game.UpdateTasks()
        @game.UpdateGamePads()
        @game.UpdateTweens()

        @game.UpdateSprites()

    Draw: ->
        @game.draw(@)
        @game.DrawSprites()


    AdvanceFrame: (timestamp) ->
        if @game.time is undefined
            @game.time = timestamp

        @game.deltaTime = Math.round(timestamp - @game.time)
        @game.time = timestamp
        elapsed = @game.deltaTime
        @drawDelta = elapsed
        @updateDelta = @frameTime

        if elapsed > 1000
            elapsed = @frameTime

        @lag += elapsed

        while @lag >= @frameTime
            @Update()

            @lag -= @frameTime

        @lagOffset = @lag / @frameTime

        @Draw()

        window.requestAnimationFrame (timestamp) =>
            @AdvanceFrame(timestamp)

    Run: (timestamp) ->
        @AdvanceFrame(0)

Torch.Loop = Loop
