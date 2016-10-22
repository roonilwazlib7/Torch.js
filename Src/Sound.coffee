Torch.Sound = {}

class PlayList extends Torch.GhostSprite
    constructor: (@game, @songList) ->
        @currentSong = @songList[0]
        @index = 0

    Play: ->
        @game.Assets.GetSound(@currentSong).volume = 0.7
        @game.Assets.GetSound(@currentSong).play()
        return @

    ShuffleArray: (array) ->
        currentIndex = array.length
        temporaryValue = null
        randomIndex = null

        # While there remain elements to shuffle...
        while 0 isnt currentIndex

            # Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1

            # And swap it with the current element.
            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue


        return array;

    Randomize: ->
        @songList = @ShuffleArray(@songList)
        @currentSong = @songList[0]
        return @

    Update: ->

    if @game.Assets.GetSound(@currentSong).currentTime >= @game.Assets.GetSound(@currentSong).duration
        @index++
        @currentSong = @songList[@index]
        @Play()
        if @index is @songList.length - 1
            @index = 0
