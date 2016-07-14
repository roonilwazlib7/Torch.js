var Observer = {
    delayedNotifications: [],
    listeners: [],
    Listen: function(MessageType, handle)
    {
        var that = this;
        that.listeners.push({
            MessageType: MessageType,
            handle: handle
        });
    },
    Notify: function(MessageType, sender, delay)
    {
        var that = this;
        if (delay)
        {
            that.delayedNotifications.push({
                delay: delay,
                sender: sender,
                MessageType: MessageType
            });
        }
        else
        {
            for (var i = 0; i < that.listeners.length; i++)
            {
                var l = that.listeners[i];
                if (l.MessageType == MessageType)
                {
                    l.handle(sender);
                }
            }
        }
    },
    Update: function()
    {
        var that = this;
        var cleanedDelayedMessages = [];
        for (var i = 0; i < that.delayedNotifications.length; i++)
        {
            var dn = that.delayedNotifications[i];
            dn.delay -= Game.deltaTime;
            if (dn.delay <= 0)
            {
                that.Notify(dn.MessageType, dn.sender);
            }
        }
        that.delayedNotifications = cleanedDelayedMessages;
    }
}
