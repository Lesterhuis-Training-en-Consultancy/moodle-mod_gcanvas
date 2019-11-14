"use strict";

module.exports = function (grunt) {
    // Running local with
    // First time npm install
    // nvm use 8.9
    // grunt --moodledir=/Users/mail/OPENSOURCE/moodle-380/

    // We need to include the core Moodle grunt file too, otherwise we can't run tasks like "amd".
    require("grunt-load-gruntfile")(grunt);

    var MOODLE_DIR = grunt.option('moodledir') || '../../';
    grunt.loadGruntfile(MOODLE_DIR + "Gruntfile.js");

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