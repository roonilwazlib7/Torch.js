class MapManager
    constructor: (@game) ->
        @Parts = {}

    LoadMap: (fileId) ->
        mapString = @game.File(fileId)

        segments = mapString.split(";")

        pieces = []

        # each map segment is a comma seperated string of hexadecimal, ie:
        # c,0,10,11;i,10,9,8,ff
        # the first number is the identifier

        for segment in segments
            identifier = segment.split(",")[0]
            segs = []
            for seg,index in segments.split(",")
                segs.push(seg) if index isnt 0
                
            pieces.push( new @Parts[identifier](segs) )
