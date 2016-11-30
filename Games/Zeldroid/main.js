var fs = require('fs');

//open up the package.json for some configuration
var packageJSON = fs.readFileSync("package.json").toString()
var packageConfig = JSON.parse( packageJSON );
var config = packageConfig.GameConfig;

packageConfig.GameConfig.Build++;

fs.writeFileSync("package.json", JSON.stringify(packageConfig, null, 4));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

function StartWindow()
{
    // Quit when all windows are closed.
    app.on('window-all-closed', function() {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform != 'darwin')
        {
            app.quit();
        }
        try
        {
            fs.unlinkSync("_tmp_index.html");
        }
        catch (e) {}

    });

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    app.on('ready', function() {


                // Create the browser window.
                mainWindow = new BrowserWindow({width: 1000, height: 625, title: "TheGame", icon: "icon.png"});

                //for development
                mainWindow.setMenuBarVisibility(false);
                mainWindow.setAutoHideMenuBar(true);
                //for release
                //mainWindow.setMenu(null);

                //mainWindow.webContents.openDevTools();

                mainWindow.maximize();
                //mainWindow.setFullScreen(true); //fullScreen

                // and load the index.html of the app.
                if (!config.Map)
                {
                    mainWindow.loadURL('file://' + __dirname + '/' + "_tmp_index.html");
                }
                else
                {
                    mainWindow.loadURL('file://' + __dirname + '/' + "MapMaker/index.html");
                }

                // Emitted when the window is closed.
                mainWindow.on('closed', function() {
                  // Dereference the window object, usually you would store windows
                  // in an array if your app supports multi windows, this is the time
                  // when you should delete the corresponding element.
                  mainWindow = null;
                });

            });
}



var electron = require('electron');
var app = electron.app;  // Module to control application life.
var BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
StartWindow();
