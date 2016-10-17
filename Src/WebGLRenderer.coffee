# big thanks to three.js for this one

exports = this

class WebGLRenderer

    constructor: (@sprite) ->

    Draw: ->
        scene = new THREE.Scene()

        scene.add( new THREE.AmbientLight( 0x404040 ) );
