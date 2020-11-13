/* browser: false */
/* eslint-env node */
"use strict";

module.exports = function(grunt) {
    // Running local with
    // First time npm install
    // nvm use 14
    // grunt --moodledir=/Users/mail/OPENSOURCE/moodle-310/
    // grunt --moodledir=../../..

    // We need to include the core Moodle grunt file too, otherwise we can't run tasks like "amd".
    try {
        if(require.resolve("grunt-load-gruntfile")){
            require("grunt-load-gruntfile")(grunt);
        }

        var MOODLE_DIR = grunt.option('moodledir') || '../../';
        grunt.loadGruntfile(MOODLE_DIR + "Gruntfile.js");

    }catch(ex){
        // Only used when running localy for compiling.
    }

    // Load all grunt tasks.
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-fixindent");

    grunt.initConfig({
        watch: {
            amd: {
                files: "amd/src/*.js",
                tasks: ["amd"]
            }
        },
        stylelint: {
            css: {},
            scss: {},
            less: {},
        },
        eslint: {
            amd: {src: "amd/src"}
        },
        uglify: {
            amd: {
                files: {
                    "amd/build/canvas.min.js": ["amd/src/canvas.js"],
                },
                options: {report: 'none'}
            }
        }
    });

    // The default task (running "grunt" in console).
    grunt.registerTask("default", ["eslint", "uglify"]);
};