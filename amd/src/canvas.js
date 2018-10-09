// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * JS Canvas
 *
 * Tested in Moodle 3.5
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package local_commander
 * @copyright 2018 MoodleFreak.com
 * @author    Luuk Verhoeven
 **/
/* eslint no-console: ["error", { allow: ["warn", "error" , "log"] }] */
define(['jquery', 'core/notification'], function ($, notification) {
    'use strict';
    /**
     *
     */
    var canvas_module = {

        /**
         *
         */
        canvas : false,

        /**
         * Default rectangle
         */
        default_shape_rect : {
            width : 200,
            height: 100,
            left  : 0,
            top   : 50,
            angle : 30,
            fill  : 'rgba(255,0,0,0.5)'
        },


        init : function () {
            // Load canvas.
        }

    };

    return {
        initialise: function () {
            console.log('Canvas Module v1.0');

        }
    };
});