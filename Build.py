import datetime
COMBINED = ""
BUILD = str(datetime.date.today().year) + "-" + str(datetime.date.today().month) + "-" + str(datetime.date.today().day);
items = ["pixl/pixl.js", "Torch.js", "Torch.Game.js","Torch.Load.js", "Torch.Timer.js","Torch.Animation.js", "Torch.Sprite.js", "Torch.Text.js", "Torch.Color.js", "Torch.StateMachine.js", "Torch.Particles.js", "Torch.Debug.js", "Torch.GamePad.js", "Torch.SpriteGroup.js", "Torch.Platformer.js"]
NAME = "Torch-" + BUILD
for path in items:
    f = open("Core/" + path)
    COMBINED += f.read()
    f.close()

COMBINED += "\n\nTorch.version='" + NAME + "'"

f = open("Builds/" + NAME + ".js", "w+")
f.write(COMBINED)
f.close()

f = open("Builds/Torch-latest.js", "w+")
f.write(COMBINED)
f.close()


print("Built: " + NAME)
