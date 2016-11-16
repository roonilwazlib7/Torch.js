import datetime
import os
import json
from jsmin import jsmin

def Write(path, content):
    f = open(path, "w+")
    f.write(content)
    f.close()

def Read(path):
    f = open(path, "r")
    content = f.read()
    f.close()
    return content

# compile Torch from coffee into js
os.system("coffee --compile --output Core/ Src/")

# grab the config file
config = json.loads ( Read(".build-config.json") )
config["Build"] += 1

COMBINED = ""
BUILD = str(datetime.date.today().year) + "-" + str(datetime.date.today().month) + "-" + str(datetime.date.today().day);
NAME = "Torch-" + BUILD

for path in config["SourceMap"]:
    COMBINED += Read("Core/" + path)

COMBINED += "\n\nTorch.build='" + NAME + "';Torch.version='" + config["Version"] + "';"

# Write("Builds/" + NAME + ".js", COMBINED)
Write("Builds/Torch-latest.min.js", jsmin(COMBINED) )
Write("Builds/Torch-latest.js", COMBINED)
Write(".build-config.json", json.dumps(config, indent=4) )

if config["Game"]["Source"] == "Coffee":
    os.system("coffee --compile --output Games/" + config["Game"]["Name"] + "/Core Games/" + config["Game"]["Name"] + "/Src")

command_script = """
@echo off
cd Games\\""" + config["Game"]["Name"] + """
npm start
del "%~f0"
"""

Write("_tmp.bat", command_script)
os.system("_tmp.bat")
