class Layer
    constructor: (@drawIndex)->
        @children = []
        @mapIndex - @drawIndex

    DrawIndex: (index) ->
        return @drawIndex if not index

        @drawIndex = index
        for child in @children
            child.DrawIndex(index)

        return @

    Add: (child) ->
        child.DrawIndex(@index)
        @children.push(child)

class Layers
    constructor: (@game) ->
        @layers = []
        @layerMap = {}

    Add: (layerName) ->
        layer = null
        if typeof layerName is "string"
            layer = new Layer( @layers.length )
            @layerName[layerName] = layer
            @layers.add( layer )
        else
            for name in layerName
                layer = new Layer( @layers.length )
                @layerMap[name] = layer
                @layers.add( layer )

    Remove: (layerName, tryToFill) ->
        if not @layerMap[layerName]
            Torch.FatalError("Unable to remove layer '#{ layerName }'. Layer does not exist")

        else
            cleanedLayers = []
            layer = layerMap[layerName]
            layer.Trash()

            delete @layerMap[layerName]

            for item,index in @layers
                l = cleanedLayers[index]

                if index isnt layer.mapIndex
                    cleanedLayers.push(l)
                    l.DrawIndex( l.DrawIndex() - 1 ) if tryToFill


    Get: (layerName) ->
        if not @layerMap[layerName]
            Torch.FatalError("Unable to get layer '#{ layerName }'. Layer does not exist")

        else return @layerMap[layerName]

Torch.Layers = Layers
