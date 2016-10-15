exports = Torch.Sound

class PlayList
    constructor: (@game, @songList) ->
        @currentSong = playList[0]
        @index = 0
