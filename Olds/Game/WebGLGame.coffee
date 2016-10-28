class Game extends Torch.CanvasGame
    constructor: (@canvasId, @width, @height, @name, @graphicsType) ->
        @InitGame()

    InitGraphics: ->
        @gl_rendererContainer = document.getElementById(@canvasId)

        @gl_scene = new THREE.Scene()
        @gl_camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 1000 )
        @gl_camera.position.z = 600
        @gl_renderer = new THREE.WebGLRenderer( {antialias: false} )
        @gl_renderer.setSize( window.innerWidth, window.innerHeight )
        @gl_renderer.setPixelRatio( window.devicePixelRatio )

        @canvasNode = @gl_renderer.domElement
        @gl_rendererContainer.appendChild(@canvasNode)

        onWindowResize = ( event ) =>

            SCREEN_WIDTH = window.innerWidth
            SCREEN_HEIGHT = window.innerHeight

            @gl_renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT )

            @gl_camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT
            @gl_camera.updateProjectionMatrix()

        window.addEventListener( 'resize', onWindowResize, false )

    DrawSprites: ->
        @spriteList.sort (a, b) ->
            return a.drawIndex - b.drawIndex

        for sprite in @spriteList
            if sprite.draw and not sprite.trash and not sprite.GHOST_SPRITE
                sprite.Draw()

        if @graphicsType is Torch.WEBGL
            @gl_camera.lookAt( @gl_scene.position )
            @gl_renderer.render( @gl_scene, @gl_camera )

    Scene: (item) ->
        @gl_scene.add(item)

Torch.WebGLGame = Game
