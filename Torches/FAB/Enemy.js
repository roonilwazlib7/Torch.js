var Enemy = function(x,y,text)
{
    this.InitSprite(x,y);
    Game.Add(this);

    var possible = ["enemy_1", "enemy_2", "enemy_3", "enemy_4"];
    var colors = ["red", "blue","green", "yellow"];
    var rand = Math.round( Math.random() * 3 );

    this.Bind.Texture(possible[rand]);

    this.health = 100 * Game.level;
    this.shield = false;

    this.MOVE_SPEED = 0.06;
    this.ROTATION_SPEED = 0.004;
    this.COLLECT_SPOT = Game.Scene.height;

    this.DrawParams = {rotation: 0};
    this.ENEMY = true;

    this.text = new Torch.Text([{text: text, font: "20px Impact bold", fillStyle: colors[rand]}], 50, 50, 20);
    this.text.drawIndex = 5;
    Game.Add(this.text);
    this.text.drawIndex = 100;
    this.text.draw = false;
}
Enemy.is(Torch.Sprite);
Enemy.prototype.Update = function()
{
    var that = this;
    if (!that.trash && !that.shield && !that.dest)
    {
        that.Rectangle.y += Game.deltaTime * that.MOVE_SPEED;
        that.DrawParams.rotation += Game.deltaTime * that.ROTATION_SPEED;

        that.text.Rectangle.x = that.Rectangle.x + 25;
        that.text.Rectangle.y = that.Rectangle.y + 25;

        if (that.Rectangle.y >= that.COLLECT_SPOT)
        {
            that.shield = true;
            that.ROTATION_SPEED *= 3;
            that.Steal();
        }
    }
    else if (that.dest)
    {

            var vec = new Torch.Vector(that.dest.x - that.Rectangle.x, that.dest.y - that.Rectangle.y);
            vec.Normalize();
            that.Rectangle.x += vec.x * Game.deltaTime;
            that.Rectangle.y += vec.y * Game.deltaTime;
            that.Trash();

    }
    else if (!that.trash && that.shield)
    {
        that.DrawParams.rotation += Game.deltaTime * that.ROTATION_SPEED;
    }


    if (that.health <= 0)
    {
        if (!that.trash)Game.Assets.GetSound("enemy_die_sound").toggle();
        that.Trash();
        that.Collect();
    }
}
Enemy.prototype.Collect = function()
{
    var that = this;
    that.text.draw = true;
    if (!that.dead){
        Game.Player.score++;
        that.dead=true;
    }
    if (!that.text.collected)
    {
        var moveVec = new Torch.Vector(Game.Player.Rectangle.x - that.text.Rectangle.x, Game.Player.Rectangle.y - that.text.Rectangle.y);
        moveVec.Normalize();
        var moveCons = 3;
        that.text.Rectangle.x += moveVec.x * moveCons;
        that.text.Rectangle.y += moveVec.y * moveCons;

        if (that.text.Rectangle.Intersects(Game.Player.Rectangle))
        {
            that.text.Trash();
            that.text.collected = true;
            Game.Assets.GetSound("collect_fab_sound").toggle();
            var defText;
            if (DEF[that.index]) defText = DEF[that.index];
            else defText = ";No Def;";
            var t = new Torch.Text([{text: defText, font: "24px Impact bold", fillStyle: "white"}], 25, 300, 48);
            Game.Add(t);
            LevelText(t);
        }
    }
}
Enemy.prototype.Steal = function()
{
    var that = this;
    if (!Game.lose){
        var t = new Torch.Text([{text: "You Lose!", font: "48px Impact bold", fillStyle: "Red"}], 420, 300, 48);
        Game.Add(t);
        Game.lose = true;
        Game.Assets.GetSound("lose_sound").play();

        for (var i = 0; i < Game.enemies.length; i++)
        {
            var en = Game.enemies[i];
            var dest = {x: 1000 * Math.random() + 1200, y: 1000 * Math.random()};
            en.dest = dest;

        }
    }
}
Enemy.prototype.Shake = function()
{
    var that = this;
    var shakeTime = 400;

}
Enemy.prototype.AddRay = function()
{

}
