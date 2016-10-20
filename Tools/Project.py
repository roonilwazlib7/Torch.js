import datetime
import os
import json

def Write(path, content):
    f = open(path, "w+")
    f.write(content)
    f.close()

def Read(path):
    f = open(path, "r")
    content = f.read()
    f.close()
    return content


config = """
{
    "BuildType": "Game"
}
"""

GameJs = """
Torch.StrictErrors();

Game = new Torch.Game("canvas", "fill", "fill", "Knackered");

function Load(game)
{

}
function Init(game)
{
    game.Clear("#000");
}
function Draw(game)
{

}
function Update(game)
{

}

Game.Start(Load, Update, Draw, Init);


"""
