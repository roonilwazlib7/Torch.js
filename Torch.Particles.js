Torch.ParticleEmitter = function(x, y, particleDecayTime, step)
{
    this.InitSprite(x,y);
    this.PARTICLE_DECAY_TIME = particleDecayTime;
    this.STEP = step;
    this.elapsedTime = 0;

    this.OnEmit = null;
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
Torch.ParticleEmitter.prototype.Emit = function()
{
    var that = this;
    that.OnEmit(that);
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
            particle.Body.x.velocity = (minX * xNeg) + ( Math.random() * ( xNeg ) * cx );
            particle.Body.y.velocity = (minY * yNeg) + ( Math.random() * ( yNeg ) * cy );
        }
        spriteGroup = new Torch.SpriteGroup(particles);
        Torch.Timer.SetFutureEvent(that.PARTICLE_DECAY_TIME, function()
        {
            spriteGroup.Trash();
        });
    };
    that.OnEmit = onEmit;
}
Torch.ParticleEmitter.prototype.CreateSlashEmitter = function(Particle, density, minY, vy, point1, point2)
{
    var that = this;
    var onEmit = function(emitter)
    {
        var spriteGroup,
            particle;
        var particles = [];
        var xDist = point2.x = point1.x;
        for (var i = 0; i < density; i++)
        {
            particle = new Particle(that.Rectangle.x, that.Rectangle.y);
            particle.Body.y.velocity = minY + (Math.random() * vy)
        }
        spriteGroup = new Torch.SpriteGroup(particles);
        Torch.Timer.SetFutureEvent(that.PARTICLE_DECAY_TIME, function()
        {
            spriteGroup.Trash();
        });
    };
    that.OnEmit = onEmit;
}
