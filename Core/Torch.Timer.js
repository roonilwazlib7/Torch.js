Torch.Timer = {
    futureEvents: [],
    Update: function()
    {
        var that = this;
        for (var i = 0; i < that.futureEvents.length; i++)
        {
            that.futureEvents[i].Update();
        }
    },
    SetFutureEvent: function(time, handle)
    {
        this.futureEvents.push(new Torch.FutureEvent(time, handle));
    }
};
Torch.FutureEvent = function(timeToOccur, handle)
{
    var that = this;
    that.time = 0;
    that.timeToOccur = timeToOccur;
    that.handle = handle;
}
Torch.FutureEvent.prototype.Update = function()
{
    var that = this;
    that.time += Game.deltaTime;
    if (that.time >= that.timeToOccur)
    {
        if (that.handle) that.handle();
        that.handle = null;
    }
}
