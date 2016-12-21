###
    @class Video
    @extends Sprite
    @alias Torch.Video

    A Video is a sprite whose "texture" is a video
###

class Video extends Torch.Sprite
    torch_render_type: "Video"
    videoElement: null

    constructor: (game, x, y, videoId) ->
        @InitSprite(game, x, y)

        videoElement = @game.Assets.GetVideo(videoId)

        @rectangle.width = videoElement.width
        @rectangle.height = videoElement.height
