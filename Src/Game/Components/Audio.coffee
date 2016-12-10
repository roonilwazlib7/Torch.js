# https://www.html5rocks.com/en/tutorials/webaudio/intro/
class Audio
    audioContext: null
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
    MasterVolume: 1
    constructor: (aud) ->
        @audioContext = aud.audioContext
        @game = aud.game

    PlaySound: (id, time = 0, filters = null) ->
        source = @audioContext.createBufferSource()
        source.buffer = @game.Assets.Audio[id].audioData
        source.connect(@audioContext.destination)

        if filters isnt null
            for filter in filters
                f = @CreateFilter(filter)
                source.connect(filter)
                filter.connect(@audioContext.destination)

        source.start(time)

Torch.Audio = Audio
