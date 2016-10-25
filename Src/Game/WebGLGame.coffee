class Game extends Torch.CanvasGame
    constructor: (@canvasId, @width, @height, @name, @graphicsType) ->
        @InitGame()

    InitGraphics: ->
        @gl_rendererContainer = document.getElementById(@canvasId)
        light = new THREE.PointLight( 0xff0000, 1, 100 );
        light.position.set(0,1,0)

        @gl_scene = new THREE.Scene()
        @gl_camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 20000 )
        @gl_camera.position.z = 500
        @gl_renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } )
        @gl_renderer.setSize( window.innerWidth, window.innerHeight )
        @gl_renderer.setPixelRatio( window.devicePixelRatio )

        @gl_scene.add(light)

        @canvasNode = @gl_renderer.domElement
        @gl_rendererContainer.appendChild(@canvasNode)

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
