var fs = require('fs');
var cluster = require('cluster');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var drawWorker = null;

function StartWindow()
{
    // Quit when all windows are closed.
    app.on('window-all-closed', function() {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform != 'darwin') {
        app.quit();
      }
    });

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    app.on('ready', function() {

        fs.readFile('build.config', 'utf8', function (err, data) {
            var path = "";
            if (err) return console.log(err);
            else
            {
                var state = data.split("|")[0];
                switch (state)
                {
                    case "GAME":
                    path = "index.html";
                    break;
                    case "MAP":
                    path = "Builder/index.html";
                    break;
                    default:
                    path = "build-error.html#" + "config type '" + state + "' is not valid";
                    break;
                }

                // Create the browser window.
                mainWindow = new BrowserWindow({width: 1000, height: 625, title: "Stratus", icon: "icon.png"});

                //for development
                mainWindow.setMenuBarVisibility(false);
                mainWindow.setAutoHideMenuBar(true);
                //for release
                //mainWindow.setMenu(null);

                mainWindow.maximize();
                //mainWindow.setFullScreen(true); //fullScreen

                // and load the index.html of the app.
                mainWindow.loadURL('file://' + __dirname + '/' + path);

                // Emitted when the window is closed.
                mainWindow.on('closed', function() {
                  // Dereference the window object, usually you would store windows
                  // in an array if your app supports multi windows, this is the time
                  // when you should delete the corresponding element.
                  mainWindow = null;
                });

                global.DrawWorker = drawWorker;

            }
        });


    });

}

if (cluster.isMaster)
{
    drawWorker = cluster.fork();

    var app = require('app');  // Module to control application life.
    var BrowserWindow = require('browser-window');  // Module to create native browser window.
    StartWindow();
}
else
{
    process.on("message", function(message){
        message = JSON.parse(message);
        if (message.torch_draw_canvas)
        {
            try
            {
                var dataUrl = message.canvas.toDataURL();
            }
            catch(e)
            {
                console.log("[!]Error converting canvas to dataURL");
                console.log(e);
            }
        }
    });

}
