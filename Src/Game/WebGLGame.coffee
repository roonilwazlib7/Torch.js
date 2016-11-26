###
    @class Torch.WebGLGame @extends Torch.CanvasGame
    @author roonilwazlib

    @constructor
        @param canvasId, string, REQUIRED
        @param width, number|string, REQUIRED
        @param height, number|string, REQUIRED
        @param name, string, REQUIRED
        @param graphicsType, enum, REQUIRED
        @param pixel, enum

    @description
        Torch.WebGLGame dictates that WEBGL, through three.js, be used to render
        graphics.
###
class WebGLGame extends Torch.CanvasGame
    constructor: (@canvasId, @width, @height, @name, @graphicsType, @pixel = 0) ->
        @InitGame()

    InitGraphics: ->
        @gl_rendererContainer = document.getElementById(@canvasId)

        @gl_scene = new THREE.Scene()

        @gl_camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 1000 )
        @gl_camera.position.z = 600

        @gl_renderer = new THREE.WebGLRenderer( {antialias: @pixel isnt Torch.PIXEL} )
        @gl_renderer.setSize( window.innerWidth, window.innerHeight )
        @gl_renderer.setPixelRatio( window.devicePixelRatio )

        @canvasNode = @gl_renderer.domElement
        @gl_rendererContainer.appendChild(@canvasNode)


        @On "Resize", ( event ) =>
            @gl_renderer.setSize( @Viewport.width, @Viewport.height )
            @gl_camera.aspect = @Viewport.width / @Viewport.height
            @gl_camera.updateProjectionMatrix()

    DrawSprites: ->
        @spriteList.sort (a, b) ->
            return a.drawIndex - b.drawIndex

        for sprite in @spriteList
            if sprite.draw and not sprite.trash and not sprite.GHOST_SPRITE
                sprite.Draw()
            if sprite.trash
                sprite.Three().Remove()

        @gl_camera.lookAt( @gl_scene.position )
        @gl_renderer.render( @gl_scene, @gl_camera )

    UpdateSprites: ->
        cleanedSprites = []
        for sprite in @spriteList
            if not sprite.trash
                if not sprite.game.paused
                    sprite.Update()
                cleanedSprites.push(sprite)
            else
                if sprite.Three() isnt undefined
                    sprite.Three().Remove()

                sprite.trashed = true
                sprite.Emit("Trash")
        @spriteList = cleanedSprites

    GetThreeTransform: (x, y)->
        vector = new THREE.Vector3()
        camera = @gl_camera

        vector.set(
                    ( x / window.innerWidth ) * 2 - 1,
                    -( y / window.innerHeight ) * 2 + 1,
                    1 )

        vector.unproject( camera )

        dir = vector.sub( camera.position ).normalize()

        distance = - camera.position.z / dir.z

        pos = camera.position.clone().add( dir.multiplyScalar( distance ) )

        return pos

Torch.WebGLGame = WebGLGame
