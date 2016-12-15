class Camera
    position: null
    _jerkFollow: null
    constructor: (@game) ->
        @position = new Point(0,0)
        @Viewport = new Viewport(@)

    JerkFollow: (sprite, offset = 5, config) ->
        if not config?
            config =
                maxLeft: -500
                maxRight: 2000
                maxTop: -500
                maxBottom: 2000

        @_jerkFollow = new JerkFollow(@, sprite, offset, config)

    Update: ->
        @Viewport.Update()

        if @_jerkFollow?
            @_jerkFollow.Update()

class Viewport
    width: 0
    height: 0
    maxWidth: 0
    maxHeight: 0
    constructor: (@camera) ->
        @maxWidth = @width = window.innerWidth
        @maxHeight = @height = window.innerHeight
        @rectangle = new Rectangle(@camera.position.x, @camera.position.y, @width, @height)

    Update: ->
        @rectangle.x = @camera.position.x
        @rectangle.y = @camera.position.y
        @rectangle.width = @width
        @rectangle.height = @height

class JerkFollow
    boundLeft: 0
    boundRight: 0
    boundTop: 0
    boundBottom: 0
    Inc: 0

    constructor: (@camera, @sprite, offset, @config) ->
        v = @camera.Viewport
        @game = @camera.game
        @Inc = v.width / offset
        @boundLeft = v.width / offset
        @boundRight = v.width - @boundLeft
        @boundTop = 0

    Update: ->
        if @sprite.position.x >= @boundRight

            if @sprite.position.x >= @config.maxRight
                @sprite.position.x = @boundRight
                return

            @boundRight += @Inc
            @boundLeft += @Inc

            @game.Tweens.Tween( @camera.position, 500, Torch.Easing.Smooth ).To({x: @camera.position.x - @Inc})

        if @sprite.position.x <= @boundLeft

            if @sprite.position.x <= @config.maxLeft
                @sprite.position.x = @boundLeft
                return

            @boundRight -= @Inc
            @boundLeft -= @Inc

            @game.Tweens.Tween( @camera.position, 500, Torch.Easing.Smooth ).To({x: @camera.position.x + @Inc})

        if @sprite.position.y <= @boundTop

            if @sprite.position.y <= @config.maxTop
                @sprite.position.y = @boundTop
                return

            @boundTop -= @Inc
            @boundBottom -= @Inc

            @game.Tweens.Tween( @camera.position, 500, Torch.Easing.Smooth ).To({x: @camera.position.y + @Inc})
