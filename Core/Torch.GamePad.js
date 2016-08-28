Torch.GamePad = function(nativeGamePad)
{
    var that = this;
    this.nativeGamePad = nativeGamePad;
    if (that.nativeGamePad)
    {
        that.A = {down: that.nativeGamePad.buttons[0].pressed};
        that.B = {down: that.nativeGamePad.buttons[1].pressed};
        that.X = {down: that.nativeGamePad.buttons[2].pressed};
        that.Y = {down: that.nativeGamePad.buttons[3].pressed};

        that.DPadLeft = {down: that.nativeGamePad.buttons[14].pressed};
        that.DPadRight = {down: that.nativeGamePad.buttons[15].pressed};
        that.DPadUp = {down: that.nativeGamePad.buttons[13].pressed};
        that.DPadDown = {down: that.nativeGamePad.buttons[12].pressed};

        that.Start = {down: that.nativeGamePad.buttons[9].pressed};
        that.Back = {down: that.nativeGamePad.buttons[8].pressed};

        that.LeftTrigger = {down: that.nativeGamePad.buttons[6].pressed};
        that.RightTrigger = {down: that.nativeGamePad.buttons[7].pressed};

        that.LeftBumper = {down: that.nativeGamePad.buttons[4].pressed};
        that.RightBumper = {down: that.nativeGamePad.buttons[5].pressed};

        that.RightStick = {down: that.nativeGamePad.buttons[11].pressed};
        that.LeftStick = {down: that.nativeGamePad.buttons[10].pressed};
    }
}
Torch.GamePad.prototype.Debug = function()
{
    var that = this;
    for (var i = 0; i < that.nativeGamePad.buttons.length; i++)
    {
        if (that.nativeGamePad.buttons[i].pressed)
        {
            console.log(that.nativeGamePad.buttons[i]);
            console.log("pressed");
        }
    }
}
Torch.GamePad.prototype.A = function()
{
    var that = this;
    return that.nativeGamePad.buttons[4];
}
