class Sound
    volume: 1
    pan: 0
    constructor: (@soundId) ->
class Audio
    audioContext: null
    MasterVolume: 1
    constructor: (@game) ->
        @GetAudioContext()

    GetAudioContext: ->
        try
            window.AudioContext = window.AudioContext or window.webkitAudioContext;
            @audioContext = new AudioContext()

        catch e
            console.warn("Unable to initialize audio...")

    DecodeAudioData: (data, callback) ->
        @audioContext.decodeAudioData data, (buffer) ->
            callback(buffer)

    CreateAudioPlayer: ->
        return new AudioPlayer(@)

class AudioPlayer
    volume: 1
    constructor: (aud) ->
        @audioContext = aud.audioContext
        @game = aud.game

    CreateGain: (gain = 1) ->
        gainNode = @audioContext.createGain()
        gainNode.gain.value = gain
        return gainNode

    Play: (sound) ->
        @game.FatalError("Cannot play sound. sound must be Torch.Sound")

    PlaySound: (id, time = 0, filters = null) ->
        source = @audioContext.createBufferSource()
        source.buffer = @game.Assets.Audio[id].audioData

        if @game.Audio.MasterVolume isnt 1
            if filters is null
                filters = [@CreateGain(@game.Audio.MasterVolume)]
            else
                filters.push(@CreateGain(@game.Audio.MasterVolume))

        if filters is null
            filters = [@CreateGain(@volume)]
        else
            filters = [filters..., @CreateGain(@volume)]

        lastFilter = null

        for filter,index in filters
            if lastFilter is null
                source.connect(filter)
            else
                lastFilter.connect(filter)

            lastFilter = filter

            if index is filters.length - 1
                filter.connect(@audioContext.destination)
                source.start(time)
                return

        source.connect(@audioContext.destination)
        source.start(time)

Torch.Audio = Audio
