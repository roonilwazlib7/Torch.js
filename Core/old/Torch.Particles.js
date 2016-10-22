Torch.ParticleEmitter = function(x, y, particleDecayTime, step, once)
{
    this.InitSprite(x,y);
    this.PARTICLE_DECAY_TIME = particleDecayTime;
    this.STEP = step;
    this.elapsedTime = 0;

    this.OnEmit = null;
    if (once) this.once = true;
}
Torch.ParticleEmitter.is(Torch.GhostSprite)
Torch.ParticleEmitter.prototype.Update = function()
{
    var that = this;
    that.BaseUpdate();
    that.elapsedTime += Game.deltaTime;
    if (that.elapsedTime >= that.STEP)
    {
        that.Emit();
        that.elapsedTime = 0;
    }
}
Torch.ParticleEmitter.prototype.KeepParticles = function()
{
    this.keepParticles = true;
}
Torch.ParticleEmitter.prototype.Emit = function()
{
    var that = this;
    that.OnEmit(that);
    if (that.once)
    {
        that.Trash();
    }
}
Torch.ParticleEmitter.prototype.CreateBurstEmitter = function(Particle, density, cx, cy, minX, minY)
{
    var that = this;
    var onEmit = function(emitter)
    {
        var spriteGroup,
            particle;
        var particles = [];
        for (var i = 0; i < density; i++)
        {
            particle = new Particle(that.Rectangle.x, that.Rectangle.y);
            particles.push(particle);
            var xNeg = Math.random() > 0.5 ? 1 : -1;
            var yNeg = Math.random() > 0.5 ? 1 : -1;
            var xDir = Math.random() * ( xNeg );
            var yDir = Math.random() * ( yNeg );
            var dirVector = new Torch.Vector(xDir, yDir);
            dirVector.Normalize();
            particle.Body.x.velocity = ( dirVector.x * cx );
            particle.Body.y.velocity = ( dirVector.y * cy );
        }
        spriteGroup = new Torch.SpriteGroup(particles);
        Torch.Timer.SetFutureEvent(that.PARTICLE_DECAY_TIME, function()
        {
            if (!that.keepParticles)
            {
                spriteGroup.Trash();
            }
            else
            {
                spriteGroup.All(function(sprite){
                    sprite.Body.x.velocity = 0;
                    sprite.Body.y.velocity = 0;
                });
            }
        });
    };
    that.OnEmit = onEmit;
}
Torch.ParticleEmitter.prototype.CreateFountainEmitter = function()
{
    var that = this;
}
Torch.ParticleEmitter.prototype.CreateSlashEmitter = function(Particle, density, minY, vy, point1, point2)
{
    var that = this;
    var onEmit = function(emitter)
    {
        var spriteGroup,
            particle;
        var particles = [];
        var xDist = point2.x - point1.x;
        var xStep = xDist / 10

        for (var j = 0; j < xDist; j++)
        {
            for (var i = 0; i < density; i++)
            {
                particle = new Particle(that.Rectangle.x + (xStep * j), that.Rectangle.y);
                particle.Body.y.velocity = minY + (Math.random() * vy)
            }
        }


        spriteGroup = new Torch.SpriteGroup(particles);
        Torch.Timer.SetFutureEvent(that.PARTICLE_DECAY_TIME, function()
        {
            spriteGroup.Trash();
        });
    };
    that.OnEmit = onEmit;
}
