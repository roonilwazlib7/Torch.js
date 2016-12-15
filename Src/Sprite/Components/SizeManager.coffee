class SizeManager
    width: 0
    height: 0
    scale: null

    constructor: (@sprite) ->
        rect = @sprite.rectangle
        @width = rect.width
        @height = rect.height
        @scale = {width: 1, height: 1}

    Update: ->
        rect = @sprite.rectangle

        rect.width = @width * @scale.width
        rect.height = @height * @scale.height

    Set: (width, height) ->
        @width = width
        @height = height

    Scale: (widthScale, heightScale) ->
        @scale.width = widthScale
        @scale.height = heightScale
