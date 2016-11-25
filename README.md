# Torch.js
A sick HTML5 game development framework

Can be used to create web games or standalone electron applications

Team site: http://www.torchjs.slack.com

## Source
Torch.js is written in coffee script and can be found in the <b>Src/</b> folder

## Builds
The compiled javascript can be found in the <b>Builds/</b> folder

## Tools
Torch.js comes with a few tools found in the <b>Tools/</b> folder

### Build.js
A node app that puts the source together

### Project.js
A node app that can be used to set up a new Torch.js project

## Prerequisites
(for building the source and making electron games)

* node js
    * Packages:
        * node-minify
        * electron
        * shelljs
* coffeescript

### basically, follow these commands: (linux)
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

npm install -g coffee-script

(switch to Tools/Build) npm install

(switch to current game) npm install
