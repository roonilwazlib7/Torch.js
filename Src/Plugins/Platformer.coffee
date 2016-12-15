Torch.Platformer =
    Gravity: 0.001
    SHIFT_COLLIDE_LEFT: 5

    SetWorld: (spawnItems) ->
        Torch.Platformer.spawnItems = spawnItems


# the Actor class. Any sort of character is an Actor

class Actor

    ACTOR: true
    Health: 100
    currentFriction: 1
    inFluid: false
    onGround: false
    onLeft: false
    onTop: false
    onRight: false
    hitLockCounter: 0
    hitLockBlinkCounter: 0
    hitLock: false
    hitLockMax: 1000

    constructor: ->
        # shouldn't ever be making Actors, its a base class
        throw "Actor is a base class"

    HitLock: -> @hitLock = true

    Hit: (amount = 1) ->
        @Health -= amount

        @Die if @Health <= 0

    Die: -> @isDead = true

    BlockCollision: (item, offset) ->
        if offset

            if offset.vx < offset.halfWidths and offset.vy < offset.halfHeights

                if offset.x < offset.y

                    @Body.Velocity("y", 0)

                    if offset.vx > 0
                        #colDir = "l"
                        if not item.Sprite.Slope
                            @Rectangle.x += offset.x + Torch.Platformer.SHIFT_COLLIDE_LEFT
                            @Body.Velocity("x", 0)
                            @onLeft = true
                        else
                            @BlockSlope(item.Sprite, offset)
                    else if offset.vx < 0
                        #colDir = "r"
                        if (not item.Sprite.Slope)
                            @Rectangle.x -= offset.x
                            @Body.Velocity("x", 0)
                            @onRight = true
                        else
                            @BlockSlope(item.Sprite, offset)

                else if offset.x > offset.y

                    if offset.vy > 0
                        #colDir = "t"
                        @Rectangle.y += offset.y
                        @Body.Velocity("y", 0)

                    else if  offset.vy < 0
                        #colDir = "b"
                        if not item.Sprite.Slope
                            @Rectangle.y -= (offset.y - item.Sprite.sink)
                            @Body.Acceleration("y", 0).Velocity("y", 0)
                            @onGround = true
                            if not @inFluid then @currentFriction = item.Sprite.friction
                        else
                            @BlockSlope(item.Sprite, offset)

    BlockSlope: (block, offset) ->
        # keep how far it's moved, but change y
        Yoffset = offset.x * Math.tan(block.Slope)
        # @Rectangle.y -= Yoffset
        @Rectangle.y = ( block.Rectangle.y + (block.Rectangle.height - Yoffset) - @Rectangle.height )
        @onSlope = true

    FluidCollision: (item, offset) ->
        if offset
            @currentFriction = item.Sprite.friction
            @Body.y.acceleration = item.Sprite.gravity
            @inFluid = true

    UpdateActor: ->
        @inFluid = false
        @onGround = false
        @onTop = false
        @onRight = false
        @onLeft = false

        for item in Torch.Platformer.spawnItems

            rect = @Rectangle

            if (item.spawned and item.Sprite and item.Sprite.BLOCK and @NotSelf(item.Sprite) and (@ACTOR) )
                offset = @Rectangle.Intersects(item.Sprite.Rectangle)
                @BlockCollision(item, offset)
            if (item.spawned and item.Sprite and item.Sprite.FLUID and @NotSelf(item.Sprite) and (@ACTOR) )
                offset = @Rectangle.Intersects(item.Sprite.Rectangle)
                @FluidCollision(item, offset)
            if not @onGround and not @inFluid then @Body.y.acceleration = Torch.Platformer.Gravity

        if @hitLock

            @hitLockCounter += Game.deltaTime
            @hitLockBlinkCounter += Game.deltaTime

            if @hitLockBlinkCounter >= 200

                if (@opacity == 0.1)
                    @opacity = 0.8
                else
                    @opacity = 0.1

                @hitLockBlinkCounter = 0

            if @hitLockCounter >= @hitLockMax
                @hitLock = false
                @opacity = 1
                @hitLockCounter = 0
                @hitLockBlinkCounter = 0

# the Block class

class Block
    BLOCK: true
    friction: 1
    sink: 0
    constructor: ->
        throw "Block is a base class"

# the Fluid class

class Fluid
    FLUID: true
    friction: 0.3
    gravity: 0.0001
    drawIndex: 30
    constructor: ->
        throw "Fluid is a base class"

# the Spawner class

class Spawner extends Torch.GhostSprite
     constructor: (@spawnItems) ->
         Torch.Platformer.SetWorld(@spawnItems)

    FlushSprites: ->

        for item in @spawnItems

            item.Sprite.Trash() if item.Sprite

    Update: ->

            if @spawnItems.length > 0

                viewRect = Game.Viewport.GetViewRectangle()

                for item in @spriteList

                    if not item.Manual
                        newRec =
                            x: item.Sprite.Rectangle.x
                            y: item.Sprite.Rectangle.y
                            width: item.Sprite.Rectangle.width
                            height: item.Sprite.Rectangle.height

                        if not item.spawned and not item.dead and item.DisableDynamicSpawning

                            spr = @SpawnTypes[item.SpawnType](item.Position, item, item.addData)
                            item.Sprite = spr
                            item.spawned = true
                            spr.spawnItem = item

                        else if (not item.spawned and not item.dead and viewRect.Intersects( {x: item.Position.x, y: item.Position.y, width: (item.width * Game.SCALE), height: (item.height * Game.SCALE)} ) )

                            if (item.SpawnType)

                                spr = @SpawnTypes[item.SpawnType](item.Position, item, item.addData)
                                item.Sprite = spr
                                item.spawned = true
                                spr.spawnItem = item

                        else if item.spawned and item.Sprite and item.Sprite.Rectangle and not viewRect.Intersects(newRec)

                            item.Sprite.Trash()
                            item.Sprite = null
                            item.spawned = false

# the SpawnItem class

class SpawnItem
    constructor: (@spawnType, @spawned, @obj, @position) ->
        @Sprite = @obj if @obj

# Some enums

exports.Facing = Torch.Enum("Right", "Left")
exports.Walking = Torch.Enum("Right", "Left", "None")

# put everything together

Torch.Platformer.Actor = Actor
Torch.Platformer.Block = Block
Torch.Platformer.Fluid = Fluid
Torch.Platformer.Spawner = Spawner
Torch.Platformer.spawnItem = SpawnItem
