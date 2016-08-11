module.exports = function ( grunt ) {
  'use strict';

  // Enable time-grunt for nice reporting of time spent on grunt tasks
  require( 'time-grunt' )( grunt );
  // load all grunt tasks without specifying them by name
  require( 'matchdep' ).filterDev( 'grunt-*' ).forEach( grunt.loadNpmTasks );

  // **lib module**
  //
  // this module include some utilities, like lib.format, lib.isNullOrEmpty, lib.isNull, lib.extend, etc
  var lib = require( 'grunt-ez-frontend/lib/lib.js' );

  var pkg = grunt.file.readJSON( 'package.json' );

  // **gruntTaskUtils**
  //
  // This module provides some helpers used on this configuration file, like `gruntTaksUtils.registerTasks`,
  // `gruntTaskUtils.beautifier`, `gruntTaskUtils.validateTemplates`, `gruntTaskUtils.compileTemplates` and others...
  var gruntTaskUtils = require( 'grunt-ez-frontend/lib/grunt-task-utils.js' )( grunt );

  // **gruntTaskUtils.beautifier**
  //
  // The beautifier object with the onBeautified method used to do some extra formatting after the
  // jsbeautifer task finished. The issue here is that jsbeautifier converts this:
  //
  //```javascript
  // var someVar = !!someVar;  //extra unneeded space.
  // if (!!someVar) {          //extra unneeded space.
  //   //doSomething...
  // }
  //```
  //
  // to this:
  //
  //```javascript
  // var someVar = !!someVar;
  // if (!!someVar) {
  //   //doSomething
  // }
  //```
  //
  // so we fix this using the onBeautified method provided by this object.
  var beautifier = gruntTaskUtils.beautifier;

  var cfg = {
    pkg: pkg,
    bump: {
      options: {
        pushTo: 'origin'
      }
    },
    // region ### jsbeautifier
    // This task correct any formatting issue in the javascript files by automatically applying the right format
    // the format is controlled by the `grunt-deps/beautify-config.json` file.
    // Additional transformations are done after the file is beautified as described above.
    jsbeautifier: {
      options: {
        // verify and rewrite any offending not formatted file
        mode: "VERIFY_AND_WRITE",
        // use the configuration from this json file
        config: "grunt-deps/beautify-config.json",
        // apply extra transformations. TODO: this should be done inside jsbeautifier
        onBeautified: beautifier.onBeautified
      },
      // beautify the gruntfile
      'grunt-file': {
        src: [ 'Gruntfile.js' ]
      }
    },
    // endregion

    // region ### jsvalidate
    // validate the javascript files looking for syntax errors. It complements jshint and it is based on Esprima.
    jsvalidate: {
      options: {
        globals: {},
        esprimaOptions: {},
        verbose: false
      },
      targetName: {
        files: {
          src: [ 'Gruntfile.js' ]
        }
      }
    },
    // endregion

    // region ### jshint
    //
    // validate the javascript files against jshint
    jshint: {
      develFiles: {
        files: {
          src: [ 'Gruntfile.js' ]
        },
        // the default configuration is taken from this file
        options: {
          jshintrc: 'grunt-deps/.jshintrc'
        }
      }
    },

    // region ### ez-frontend
    // ez-frontend is a multi task to generate concatenated and minimised targets for css and javascript.
    // In order to achieve this goal, it creates targets for `cLess` (the custom less processor we use),
    // `autoprefixer`, and `csso` in case of a css target (less|css to css) as well as preprocess and
    // uglify targets for javascript.
    //
    // The options are passed to each of the targets. In case some of them overlap between them, you should
    // declare the options in the specific multi target instead of in the global one.
    'ez-frontend': {
      options: {
        // **preprocess, uglify, cLess bannerFile option**
        // The banner file to be used for all targets
        bannerFile: 'source-banner.txt',

        // **cLess rewritePathTemplate option**
        //
        // Files referenced by the less files are copied during processing to the output folder, under the `assets/` folder.
        // This way we are sure that the files we deploy are the ones actually referecend by our less files.
        //
        // This controls the format of the rewritten url for the copied assets referenced in the less/css files.
        //
        // - **{0}** will be replaced by the **assetsVersion**
        // - **{1}** will be replaced by the **md5 of the referenced url**
        // - **{2}** will be the original **name of the asset**
        rewritePathTemplate: 'assets/{1}_{2}',
        // **preprocess separator option**
        // use two carriage lines to avoid including an extra ';' at the beginning of the js files
        separator: '\n\n'
      },
      'css-qunit': {
        src: [
          'less/anim.less',
          'less/qunit.less'
        ],
        dest: 'dist/qunit-dark.css'
      }
    },
    // region ### jsonlint
    // this task validates that the json files used to configure jshint, jscs and jsbeautifier are valid json files
    jsonlint: {

      // the package.json
      pkg: {
        src: [ 'package.json' ]
      },

      // the Javascript Code Style Checker config
      jscs: {
        src: [ 'grunt-deps/.jscs.json' ]
      },

      // the jshint config
      jshint: {
        src: [ 'grunt-deps/.jshintrc' ]
      },

      // the jsbeautifier config
      jsbeautifier: {
        src: [ 'grunt-deps/beautify-config.json' ]
      }
    },
    // endregion

    // region ### Javascript Code Style Checker
    // validates the coding style of the files against the given configuration
    // which is stored under grunt-deps/.jscs.json file
    jscs: {
      kwl: {
        src: [ 'Gruntfile.js' ]
      },
      options: {
        config: 'grunt-deps/.jscs.json'
      }
    },
    // endregion

    qunit: {
      all: [ 'test/index.html' ]
    }
  };

  grunt.initConfig( cfg );

  var gruntTasks = {

    "validate": [ 'jsbeautifier', 'jshint', 'jscs', 'jsvalidate' ],

    "css": [ 'cLess', 'autoprefixer', 'csso' ],

    "test": [ 'qunit' ],

    "default": [ 'validate', 'ez-frontend', 'css' ]
  };

  // finally register all those tasks above mentioned!
  gruntTaskUtils.registerTasks( gruntTasks );

  // grunt.registerTask('default', ['bump'])

};
