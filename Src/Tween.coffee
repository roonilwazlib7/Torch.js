class TweenTask
    trash: false
    constructor(@game, @object, @time, @props, @type, @finish) ->
        @t = 0
        @steps = GetSteps()
        @onStep = null
        @onFinish = null

    Update: ->
        @t += @game.deltaTime

        @Step()

        if @t >= time
            @trash = true

    Step: ->
        for prop of props
            @object[prop] += @steps[prop]

        @onStep() if @onStep isnt null 
