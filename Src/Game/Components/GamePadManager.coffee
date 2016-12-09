class GamePad
    @MixIn EventDispatcher

    connected: false
    buttons: null
    sticks: null

    constructor: (@game, @index) ->
        @InitEventDispatch()
        @buttons =
            A: new GamePadButton(@, 1)
            B: new GamePadButton(@, 2)
            Y: new GamePadButton(@, 3)
            X: new GamePadButton(@, 4)
        @buttonMap = ["A", "B", "Y", "X"]

        @sticks =
            LeftStick: new GamePadStick(@, 1)
            RightStick: new GamePadStick(@, 2)
        @stickMap = ["LeftStick", "RightStick"]

    SetState: (nativeGamePad) ->
        @connected = nativeGamePad.connected
        for nativeButton,index in nativeGamePad.buttons
            button = @buttons[ @buttonMap[index] ]
            button.SetState(nativeButton)
        for nativeStick,index in nativeGamePad.axes
            stick = @sticks[ @stickMap[index] ]
            stick.SetState(nativeStick)

class GamePadManager
    _pads: null
    constructor: (@game) ->
        @_pads = [new GamePad(@game),new GamePad(@game),new GamePad(@game),new GamePad(@game)]

    Pad: (index) ->
        return @_pads[index]

    Update: ->
        nativeGamePads = navigator.getGamepads()
        for pad,index in nativeGamePads
            @_pads[index].SetState(pad)

class GamePadButton
    @MixIn EventDispatcher
    _wasDown: false
    down: false

    constructor: (@gamePad, @buttonCode) ->
        @InitEventDispatch()
        @game = @gamePad.game

    SetState: (nativeGamePadButton) ->
        if @_wasDown and not nativeGamePadButton.pressed
            @Emit "ButtonPressed", new Torch.Event(@game, {button: @})

        @down = nativeGamePadButton.pressed
        @_wasDown = @down

class GamePadStick
    @MixIn EventDispatcher

    constructor: (@gamePad, @buttonCode) ->
