class Animation
    constructor: (@game) ->

    Run: ->
    	if @animating
    		@Update()
    	if @Kill and @hasRun
    		@Stop()

    Start: -> @animating = true

    Stop: -> @animating = false

    Single: ->
    	@KillOnFirstRun = true
    	@animating = true

    Reset: ->
    	@elapsedTime = 0
    	@textureListIndex = 0
    	@hasRun = false

class TexturePack extends Animation
    constructor: (@texturePack, @game) ->
    	@step = 50
    	@maxIndex = texturePack.length - 1
    	@textureIndex = 0
    	@elapsedTime = 0
    	@game.animations.push(@)

    Update: ->
    	@elapsedTime += @game.deltaTime

    	if @elapsedTime >= @step

    		@elapsedTime = 0
    		@textureIndex++

    	if @textureIndex > @maxIndex

    		if !@Kill
                @textureIndex = 0
    		if @Kill
                @textureIndex = -1
	        @hasRun = true

    GetCurrentFrame: ->
        return @game.Assets.Textures[@texturePack[@textureIndex]]

class TextureSheet extends Animation
    constructor: (@TextureSheet, @game) ->
    	@step = 50
    	@maxIndex = @TextureSheet.length - 1
    	@textureIndex = 0
    	@elapsedTime = 0
    	@delay = 0
    	@delayCount = 0
    	@onStep = null
    	@game.animations.push(@)

    Update: ->
    	@elapsedTime += @game.deltaTime;

    	if @elapsedTime >= @step and not (@hasRun and @Kill)
    		@elapsedTime = 0
    		@textureIndex++
    		if @onStep
                @onStep(@textureIndex)
    	if @textureIndex >= @maxIndex && @delayCount <= 0
    		if not @Kill
                @textureIndex = 0
    		#if (@Kill) @textureIndex = @TextureSheet.length - 1
    		#@TextureSheet = null
    		@hasRun = true
    		if @finishCallBack
                @finishCallBack()
    		@delayCount = @delay
    	else if @textureIndex >= @maxIndex
    		@delayCount -= Game.deltaTime
    		@textureIndex--

    GetCurrentFrame: ->
    	if @TextureSheet
    		return @TextureSheet[@textureIndex]

    Step: (step, onStep) ->
    	if step is undefined
    		return @step
    	else
    		@step = step
    		if (onStep isnt undefined)
    			@onStep = onStep
    	return @

class StepAnimation extends Torch.GhostSprite
    constructor: (game, totalTime, steps, start, end) ->
    	@InitSprite(game, 0, 0)
    	@steps = steps
    	@totalTime = totalTime
    	@interval = totalTime / steps.length
    	@time = 0
    	@index = 0
    	@steps[0]()
    	@start = start
    	@end = end
    	if start
            @start()

    Update: ->
    	@time += @game.deltaTime
    	if @time >= @interval
    		@time = 0
    		@index++
    		@steps[@index]()
    		if @index is @steps.length - 1
    			if @end
                    @end()
    			@Trash()


# expose to Torch
Torch.Animation = Animation
Torch.Animation.TextureSheet = TextureSheet
Torch.Animation.TexturePack = TexturePack
Torch.Animation.StepAnimation = StepAnimation
