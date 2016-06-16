import datetime
COMBINED = ""
BUILD = str(datetime.date.today().year) + "-" + str(datetime.date.today().month) + "-" + str(datetime.date.today().day);
items = ["pixl/pixl.js", "Torch.js", "Torch.Game.js","Torch.Load.js", "Torch.Animation.js", "Torch.Sprite.js", "Torch.Debug.js", "Torch.GamePad.js"]
NAME = "Torch-" + BUILD + ".js"
for path in items:
    f = open(path)
    COMBINED += f.read()
    f.close()

f = open("builds/" + NAME, "w+")
f.write(COMBINED)
f.close()

f = open("builds/Torch-latest.js", "w+")
f.write(COMBINED)
f.close()


print "Built: " + NAME
