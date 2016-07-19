import re
from datetime import datetime
def Read(path):
    f = open(path)
    content = f.read()
    f.close()
    return content
def Write(path, content):
    f = open(path, "w+")
    f.write(content)
    f.close()
def ReplaceMainHeaders(text):
    headers = ["General Information:", "Basic Usage:", "Constructor:", "Usable Members:", "Usable Methods:", "Args:", "Returns:"]
    for header in headers:
        text = text.replace(header, "<span class='main-header'>" + header + "</span>")
    return text

def ReplaceFunctions(text):
    matches = re.search( r'[a-zA-Z]+\([^\)]*\)(\.[^\)]*\))?', text)
    counter = 0
    print (matches.groups() )
    while matches and matches.group(counter) :
        print(matches.group(counter))
        counter += 1
def ReplaceTypes(text):
    types = ["INT", "STRING", "BOOL", "OBJECT", "NONE", "NULL"]
    for t in types:
        text = text.replace(t, "<span class='type'>" + t + "</span>")
    return text
now = datetime.now()
date = str(now.month) + "/" + str(now.day) + "/" + str(now.year) + ", " + str(now.hour) + ":" + str(now.minute)
files = ["Color", "Text", "Rectangle", "Define-Sprite", "Create-Pixl"]
for f in files:
    infoFile = Read(f + ".info")
    template = Read("docs-style-template.html")
    title = infoFile.split("\n")[0]
    infoFile = infoFile.replace(title, "")
    title = title.replace(":", "")
    infoFile = infoFile.replace("    ", "<span class='tab'></span>")
    infoFile = infoFile.replace("\n", "<br>")
    infoFile = infoFile.replace(":code", "<div class='code'>")
    infoFile = infoFile.replace(":endcode", "</div>")
    infoFile = infoFile.replace(":TODO", "<div class='todo'><h3>TODO</h3>")
    infoFile = infoFile.replace(":ENDTODO", "</div>")
    infoFile = infoFile.replace("##", "<span class='lister glyphicon glyphicon-menu-right'></span>")
    infoFile = ReplaceTypes(infoFile)
    infoFile = ReplaceMainHeaders(infoFile)
    template = template.replace("{{body}}", infoFile)
    template = template.replace("{{title}}", title)
    template = template.replace("{{date}}", date)

    Write(f+".info.html", template)
    print("Wrote: " + f)

print("done")
