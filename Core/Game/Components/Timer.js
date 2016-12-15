// Generated by CoffeeScript 1.10.0
(function() {
  var FutureEvent, Timer;

  Timer = (function() {
    function Timer(game) {
      this.game = game;
      this.futureEvents = [];
    }

    Timer.prototype.Update = function() {
      var event, i, len, ref, results;
      ref = this.futureEvents;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        event = ref[i];
        results.push(event.Update());
      }
      return results;
    };

    Timer.prototype.SetFutureEvent = function(timeToOccur, handle) {
      return this.futureEvents.push(new FutureEvent(timeToOccur, handle, this.game));
    };

    return Timer;

  })();

  FutureEvent = (function() {
    function FutureEvent(timeToOccur1, handle1, game) {
      this.timeToOccur = timeToOccur1;
      this.handle = handle1;
      this.game = game;
      this.time = 0;
    }

    FutureEvent.prototype.Update = function() {
      this.time += this.game.deltaTime;
      if (this.time >= this.timeToOccur) {
        if (this.handle !== null && this.handle !== void 0) {
          this.handle();
          return this.handle = null;
        }
      }
    };

    return FutureEvent;

  })();

}).call(this);
