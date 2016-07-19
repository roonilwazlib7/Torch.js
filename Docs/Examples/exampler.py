def Read(path):
    f = open(path)
    content = f.read()
    f.close()
    return content
def Write(path, content):
    f = open(path, "w+")
    f.write(content)
    f.close()


FILES = ["PlatformerPlayer1","PlatformerPlayer2"]


for f in FILES:
    js = Read("code/" + f + ".js")
    template = Read("template.html")
    template = template.replace("{{code}}", js)
    template = template.replace("{{title}}", f)
    Write(f + ".info.html", template)

print ("done")
