// Generated by CoffeeScript 1.10.0
(function() {
  var State, StateMachine;

  StateMachine = (function() {
    function StateMachine(obj) {
      this.obj = obj;
      this.currentState = null;
      this.states = {};
    }

    StateMachine.prototype.State = function(stateName, stateObj) {
      if (stateObj === void 0) {
        if (this.states[stateName] === void 0) {
          Torch.FatalError("Unable to get state. State '" + stateName + "' has not been added to the state machine");
        }
        return this.states[stateName];
      } else {
        return this.states[stateName] = stateObj;
      }
    };

    StateMachine.prototype.Switch = function(newState) {
      if (this.currentState && this.currentState.End !== void 0) {
        this.currentState.End(this.obj);
      }
      if (this.State(newState).Start !== void 0) {
        this.State(newState).Start(this.obj);
      }
      return this.currentState = this.State(newState);
    };

    StateMachine.prototype.Update = function() {
      if (this.currentState !== null && this.currentState !== void 0) {
        console.log(this);
        return this.currentState.Execute(this.obj);
      }
    };

    return StateMachine;

  })();

  State = (function() {
    function State(Execute, Start, End) {
      this.Execute = Execute;
      this.Start = Start;
      this.End = End;
    }

    return State;

  })();

  Torch.StateMachine = StateMachine;

  Torch.StateMachine.State = State;

}).call(this);
