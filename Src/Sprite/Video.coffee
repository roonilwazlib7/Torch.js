###
    @class Video
    @extends Sprite
    @alias Torch.Video

    A Video is a sprite whose "texture" is a video
###

TorchModule class Video extends Sprite
    torch_render_type: "Video"
    video: null

    constructor: (game, x, y, videoId) ->
        @InitSprite(game, x, y)

        @video = @game.Assets.GetVideo(videoId)

        @rectangle.width = @video.width
        @rectangle.height = @video.height
