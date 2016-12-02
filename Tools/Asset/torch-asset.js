var fs = require("fs"),
    CSON = require("cson"),
    program = require("commander");

program
    .version('1.0.0')
    .option('-f, --file [source]', "Asset CSON file to package")
    .parse(process.argv);

console.log( program.file );
