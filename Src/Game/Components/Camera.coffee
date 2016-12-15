class Camera
    position: null

    constructor: (@game) ->
        @position = new Torch.Point(0,0)
        @Viewport = new Viewport(@)

    Update: ->
        @Viewport.Update()

class Viewport
    width: 0
    height: 0
    maxWidth: 0
    maxHeight: 0
    constructor: (@camera) ->
        @maxWidth = @width = window.innerWidth
        @maxHeight = @height = window.innerHeight
        @rectangle = new Torch.Rectangle(@camera.position.x, @camera.position.y, @width, @height)

    Update: ->
        @rectangle.x = @camera.position.x
        @rectangle.y = @camera.position.y
        @rectangle.width = @width
        @rectangle.height = @height


# expose to Torch
Torch.Camera = Camera
