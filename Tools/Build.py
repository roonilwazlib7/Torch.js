import datetime
import os
import json
COMBINED = ""
BUILD = str(datetime.date.today().year) + "-" + str(datetime.date.today().month) + "-" + str(datetime.date.today().day);
items = ["pixl/pixl.js", "Torch.js", "Torch.Keys.js",
        "Torch.Load.js",
        "math.js",
        "Torch.Sprite.js", "Torch.Text.js", "Torch.Sound.js",
        "Torch.Particles.js",
        "Torch.Debug.js", "Torch.GamePad.js",
        "Torch.Platformer.js", "SpriteGroup.js", "Game.js", "Timer.js", "Mouse.js", "StateMachine.js", "Viewport.js",
        "Camera.js", "Torch.Bind.js", "Animation.js", "Color.js", "Electron.js"]
NAME = "Torch-" + BUILD

os.system("coffee --compile --output Core/ Src/")

for path in items:
    f = open("Core/" + path)
    COMBINED += f.read()
    f.close()

COMBINED += "\n\nTorch.version='" + NAME + "';"

f = open("Builds/" + NAME + ".js", "w+")
f.write(COMBINED)
f.close()

f = open("Builds/Torch-latest.js", "w+")
f.write(COMBINED)
f.close()

f = open(".build-config.json", "r")
config_file = f.read()
f.close()


print("Built: " + NAME)
print("Starting debug...")

config = json.loads(config_file)

if config["Source"] == "Coffee":
    os.system("coffee --compile --output Games/" + config["Game"] + "/Core Games/" + config["Game"] + "/Src")

windows_script = """
@echo off
cd Games\\""" + config["Game"] + """
npm start
del _tmp.bat
"""


f = open("_tmp.bat", "w+")
f.write(windows_script)
f.close()
os.system("_tmp.bat")
