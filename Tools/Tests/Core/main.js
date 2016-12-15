shell = require("shelljs");

shell.exec("coffee --compile --output ../Core/ ../Src/")

require("./utilities.js")()
