class SpriteGrid
    constructor: (@game, @gridXml) ->
        @ParseXml()

    ParseXml: ->
        parser = new DOMParser()
        xmlDoc = parser.parseFromString(@gridXml, "text/xml")

        root = xmlDoc.getElementsByTagName("SpriteGrid")[0]

        if root is null
            @game.FatalError("Unable to parse SpriteGrid XML, no SpriteGrid tag")

        sprites = root.getElementsByTagName("Sprite")

        for sprite in sprites
            # TODO make stuff happen here

Torch.SpriteGrid = SpriteGrid
