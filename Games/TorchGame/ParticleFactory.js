var ParticleFactory = {};

ParticleFactory.Blood = function(x, y)
{
    var blood = [];
    for (var i = 0; i < 50; i++)
    {
        var b = new Torch.Sprite(x,y);
        Game.Add(b);
        b.Bind.Texture("Blood");
        blood.push(b);
        var xDir = Math.random() > 0.5 ? 1 : -1;
        b.Body.x.velocity = xDir * ( Math.random() * 0.3 - 0.3);
        b.Body.y.velocity = 0.2 + Math.random() * 0.3;
        b.drawIndex = 100;
        b.Rectangle.width *= 4;
        b.Rectangle.height *= 4;
        b.PARTICLE = true;
        b.Update = function()
        {
            var that = this;
            that.BaseUpdate();
            for (var i = 0; i < Spawner.SpawnScaffold.length; i++)
            {
                var item = Spawner.SpawnScaffold[i];
                if (item.spawned && item.Sprite && item.Sprite.BLOCK)
                {
                    var offset = that.Rectangle.Intersects( item.Sprite.Rectangle );
                    if (offset)
                    {
                        that.Body.x.velocity = 0;
                        that.Body.y.velocity = 0;
                    }
                }
            }
        }
    }
    var sg = new Torch.SpriteGroup(blood);
    Torch.Timer.SetFutureEvent(5000, function(){
        sg.Trash();
    });
}
