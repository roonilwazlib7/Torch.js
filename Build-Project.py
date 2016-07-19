
import os

def GetFile(path):
    f = open(path)
    content = f.read()
    f.close()
    return content
def WriteFile(path, content):
    f = open(path, "w+")
    f.write(content)
    f.close()

PROJECT_NAME = raw_input("Enter the project name-->")
PROJ_PATH = "Games\\" + PROJECT_NAME

INDEX_FILE = GetFile("Templates/index.html")
GAME_FILE = GetFile("Templates/Game.js")
TESTS_FILE = GetFile("Templates/tests.js")

os.system("md " + PROJ_PATH)

WriteFile(PROJ_PATH + "\\index.html", INDEX_FILE )
WriteFile(PROJ_PATH + "\\Game.js", GAME_FILE )
WriteFile(PROJ_PATH + "\\tests.js", TESTS_FILE)

raw_input("done")
