Torch.Sound = {};

Torch.Sound.PlayList = function(game, playList)
{
    this.songList = playList;
    this.game = game;
    this.currentSong = playList[0];
    this.index = 0;
}
Torch.Sound.PlayList.prototype.Play = function()
{
    var that = this;
    that.game.Assets.GetSound(that.currentSong).play();
}
Torch.Sound.PlayList.prototype.ShuffleArray = function(array)
{
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
Torch.Sound.PlayList.prototype.Randomize = function()
{
    var that = this;
    that.songList = that.ShuffleArray(that.songList);
    that.currentSong = that.songList[0];
}
Torch.Sound.PlayList.prototype.Update = function()
{
    var that = this;
    if (that.game.Assets.GetSound(that.currentSong).currentTime >= that.game.Assets.GetSound(that.currentSong).duration)
    {
        that.index++;
        that.currentSong = that.songList[that.index];
        that.Play();
        if (that.index == that.songList.length - 1)
        {
            that.index = 0;
        }
    }
}
