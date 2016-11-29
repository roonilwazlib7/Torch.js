exports = this
class MapManager
    constructor: (@game) ->
        @Parts = []
        @pieces = []
        @IdentifierMap = []

        for key,piece of MapPieces
            @Parts[piece::identifier] = piece

    LoadMap: (fileId) ->
        mapString = @game.File(fileId)
        sp = mapString.split("\n");
        metaData = sp[0];
        mapString = sp[1];

        segments = mapString.split(";")

        pieces = []

        # each map segment is a comma seperated string of hexadecimal, ie:
        # c,0,10,11;i,10,9,8,ff
        # the first number is the identifier

        for segment in segments
            break if segment is ""
            identifier = segment.split(",")[0]
            segs = []

            for seg,index in segment.split(",")
                segs.push(seg) if index isnt 0 and seg isnt ""

            pieces.push( new @Parts[identifier](@game, segs) )

exports.MapManager = MapManager
