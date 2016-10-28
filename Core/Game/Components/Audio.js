// Generated by CoffeeScript 1.10.0
(function() {
  var Audio, AudioPlayer;

  Audio = (function() {
    Audio.prototype.audioContext = null;

    function Audio(game) {
      this.game = game;
      this.GetAudioContext();
    }

    Audio.prototype.GetAudioContext = function() {
      var e, error;
      try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        return this.audioContext = new AudioContext();
      } catch (error) {
        e = error;
        return console.warn("Unable to initialize audio...");
      }
    };

    Audio.prototype.DecodeAudioData = function(data, callback) {
      return this.audioContext.decodeAudioData(data, function(buffer) {
        return callback(buffer);
      });
    };

    Audio.prototype.CreateAudioPlayer = function() {
      return new AudioPlayer(this);
    };

    return Audio;

  })();

  AudioPlayer = (function() {
    function AudioPlayer(aud) {
      this.audioContext = aud.audioContext;
      this.game = aud.game;
    }

    AudioPlayer.prototype.PlaySound = function(id, time, filters) {
      var f, filter, i, len, source;
      if (time == null) {
        time = 0;
      }
      if (filters == null) {
        filters = null;
      }
      source = this.audioContext.createBufferSource();
      source.buffer = this.game.Assets.Audio[id].audioData;
      source.connect(this.audioContext.destination);
      if (filters !== null) {
        for (i = 0, len = filters.length; i < len; i++) {
          filter = filters[i];
          f = this.CreateFilter(filter);
          source.connect(filter);
          filter.connect(this.audioContext.destination);
        }
      }
      return source.start(time);
    };

    return AudioPlayer;

  })();

}).call(this);
