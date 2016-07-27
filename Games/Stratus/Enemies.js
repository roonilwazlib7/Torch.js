var Villager = Factory.Enemy(16, 16, "villager", "Art/Enemies/Villager", "Villager");

// Villager.prototype.Update = function()
// {
//     var that = this;
//     that.BaseUpdate();
// }
Villager.prototype.Right = function()
{
    var that = this;
    that.Body.x.velocity = 0.2;
    that.Bind.TextureSheet(that.Assets.Walk_Right, {step: 250});
}

var VillagerIdleState = new Torch.StateMachine.State(
    function(villager)
    {

    },
    function(villager)
    {
        //enter
        villager.Body.x.velocity = 0;
    },
    function(villager)
    {
        //exit
    }
);
