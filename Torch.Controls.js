Torch.Controls = {};

Torch.Controls.DragDrop = function(sprite, additionalParameters)
{
    if (!sprite.controls) sprite.controls = {};

    sprite.controls.dragging = false;
    sprite.controls.bringToTop = additionalParameters.bringToTop;
    sprite.controls.stayOnTop = additionalParameters.stayOnTop;
    sprite.controls.originalDrawIndex = sprite.drawIndex;

    var update = function(sprite)
    {
        if (sprite.controls.dragging)
        {
            sprite.Rectangle.x = sprite.game.Mouse.x - (sprite.Rectangle.width / 2) - sprite.game.Viewport.x;
            sprite.Rectangle.y = sprite.game.Mouse.y - (sprite.Rectangle.height / 2) - sprite.game.Viewport.y;
        }
        if (sprite.mouseOver && sprite.game.Mouse.down && !sprite.controls.dragging)
        {
            sprite.controls.dragging = true;
            if (sprite.controls.bringToTop) sprite.drawIndex = 100;
        }
        else
        {
            sprite.controls.dragging = false;
            if (!sprite.controls.stayOnTop) sprite.drawIndex = sprite.controls.originalDrawIndex;
        }
    }

    sprite.additionalUpdates.push(update);


}

Torch.Controls.WASD = function(sprite, additionalParameters)
{

    if (!sprite.controls) sprite.controls = {};
    var wasd = sprite.controls.wasd = {};
    var params = additionalParameters ? additionalParameters : {};

    wasd.velocity = params.velocity ? params.velocity : 0.1;

    var update = function(sprite)
    {
        var game = sprite.game;

        if (game.Keys.W.down)
        {
            sprite.Rectangle.y -= sprite.controls.wasd.velocity * game.deltaTime;
        }
        if (game.Keys.A.down)
        {
            sprite.Rectangle.x -= sprite.controls.wasd.velocity * game.deltaTime;
        }
        if (game.Keys.S.down)
        {
            sprite.Rectangle.y += sprite.controls.wasd.velocity * game.deltaTime;
        }
        if (game.Keys.D.down)
        {
            sprite.Rectangle.x += sprite.controls.wasd.velocity * game.deltaTime;
        }
    }

    sprite.additionalUpdates.push(update);
}

Torch.Controls.Bind = function(sprite, control, additionalParameters)
{
    switch (control)
    {
        case "DragDrop":
            Torch.Controls.DragDrop(sprite, additionalParameters);
        break;

        case "WASD":
            Torch.Controls.WASD(sprite, additionalParameters);
        break;
    }
}
