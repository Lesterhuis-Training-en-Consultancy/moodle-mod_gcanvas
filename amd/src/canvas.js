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
/* eslint no-unused-expressions: "off"  no-console: ["error", { allow: ["warn", "error" , "log"] }] */
define(['jquery', 'core/notification', 'mod_gcanvas/spectrum', "mod_gcanvas/fabric"], function ($, notification, mod1, fabric) {
    'use strict';

    /**
     * Opts that are possible to set.
     *
     * @type {{id: number, debugjs: boolean}}
     */
    let opts = {
        id     : 0,
        debugjs: false,
    };

    /**
     * Set options base on listed options
     * @param {object} options
     */
    let set_options = function (options) {
        "use strict";
        let key, vartype;
        for (key in opts) {
            if (opts.hasOwnProperty(key) && options.hasOwnProperty(key)) {

                // Casting to prevent errors.
                vartype = typeof opts[key];
                if (vartype === "boolean") {
                    opts[key] = Boolean(options[key]);
                } else if (vartype === 'number') {
                    opts[key] = Number(options[key]);
                } else if (vartype === 'string') {
                    opts[key] = String(options[key]);
                }
                // Skip all other types.
            }
        }
    };

    /**
     * Console log debug wrapper.
     */
    let debug = {};

    /**
     * Set debug mode
     * Should only be enabled if site is in debug mode.
     * @param {boolean} isenabled
     */
    let set_debug = function (isenabled) {

        if (isenabled) {
            for (let m in console) {
                if (typeof console[m] == 'function') {
                    debug[m] = console[m].bind(window.console);
                }
            }
        } else {
            // Fake wrapper.
            for (let m in console) {
                if (typeof console[m] == 'function') {
                    debug[m] = function () {
                    };
                }
            }
        }
    };

    /**
     * Canvas holder.
     * @type fabric.Canvas
     */
    let canvas = null;

    /**
     * Module canvas wrapper.
     */
    let canvas_module = {

        /**
         * @type int
         */
        canvas_width: 800,

        /**
         * @type int
         */
        canvas_height: 500,

        /**
         * Default rectangle.
         */
        default_shape_rect: {
            width : 70,
            height: 70,
            left  : 200,
            top   : 50,
            angle : 0,
            fill  : '#ffb628'
        },

        /**
         * Default circle.
         */
        default_shape_circle: {
            radius: 40,
            left  : 200,
            top   : 50,
            fill  : '#b3cc2b'
        },

        /**
         * Default triangle.
         */
        default_shape_triangle: {
            top   : 50,
            left  : 200,
            width : 70,
            height: 70,
            fill  : '#0081b4'
        },

        /**
         * Load user there history.
         */
        load_history: function () {
            $.ajax({
                type    : 'POST',
                url     : M.cfg.wwwroot + '/mod/gcanvas/ajax.php',
                data    : {
                    sesskey: M.cfg.sesskey,
                    action : 'load_history',
                    data   : {
                        'id': opts.id,
                    }
                },
                dataType: "json",
                success : function (response) {
                    debug.log(response);
                    if(response.success){
                        $('#history').html(response.html);
                    }
                },
                error   : function (response) {
                    debug.error(response.responseText);
                    // Show a error messages.
                    notification.addNotification({
                        message: response.responseText,
                        type   : "error"
                    });
                }
            });
        },

        /**
         * Toolbar actions.
         */
        load_toolbar: function () {

            $('#toolbar .icon[data-element-type]').on('click', function () {

                let elementtype = $(this).data('element-type');

                try {
                    canvas.discardActiveObject();
                } catch (e) {
                    // if nothing is added this gives a error.
                }

                let shape = "default_shape_" + elementtype.toLowerCase();
                debug.log("Search for shape: " + shape);

                if (canvas_module.hasOwnProperty(shape)) {
                    debug.log("Shape found");

                    let el = new fabric[elementtype](canvas_module[shape]);

                    canvas.add(el);
                    canvas.setActiveObject(el);
                } else {
                    debug.error('Shape not found!');
                }

                canvas.renderAll();
            });

            // Arrow
            $('#arrow').on('click', function () {
                fabric.loadSVGFromURL('pix/arrow.svg', function (objects, options) {

                    let arrow = fabric.util.groupSVGElements(objects, options);
                    canvas.add(arrow.scale(0.1));
                    arrow.set({
                        left: 200,
                        top : 100
                    }).setCoords();
                    canvas.renderAll();
                    canvas.setActiveObject(el);

                    canvas.forEachObject(function (obj) {
                        var setCoords = obj.setCoords.bind(obj);
                        obj.on({
                            moving  : setCoords,
                            scaling : setCoords,
                            rotating: setCoords
                        });
                    })
                });
            });

            // Remove selected items.
            $('#trash').on('click', function (e) {
                e.preventDefault();
                try {
                    let activeobjects = canvas.getActiveObjects();
                    canvas.discardActiveObject();
                    if (activeobjects.length) {
                        canvas.remove.apply(canvas, activeobjects);
                    }
                } catch (e) {
                    debug.error('Nothing selected', e);
                }
            });

            // Color picker.
            $("#colorpicker").spectrum({
                showPalette         : true,
                palette             : [],
                showSelectionPalette: true, // true by default
                selectionPalette    : ["red", "green", "blue", "orange"],
                flat                : false,
                change              : function (color) {
                    debug.log('change color');
                    canvas_module.set_color(color);
                }
            }).on("dragstart.spectrum , dragstop.spectrum", function (e, color) {
                    debug.log('change color - dragstop - dragstart');
                    canvas_module.set_color(color);
                }
            );

            // Canvas to image.
            $('#save-canvas').on('click', function () {
                // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
                if (!fabric.Canvas.supports('toDataURL')) {

                    notification.addNotification({
                        message: 'This browser doesn\'t provide means to serialize canvas to an image',
                        type   : "error"
                    });

                } else {

                    // Send data to AJAX.
                    $.ajax({
                        type    : 'POST',
                        url     : M.cfg.wwwroot + '/mod/gcanvas/ajax.php',
                        data    : {
                            sesskey: M.cfg.sesskey,
                            action : 'save_canvas',
                            data   : {
                                'id'         : opts.id,
                                'status'     : 'final',
                                'canvas_data': canvas.toDataURL({
                                    multiplier: 1,
                                    format    : 'png'
                                }),
                                'json_data'  : JSON.stringify(canvas)
                            }
                        },
                        dataType: "json",
                        success : function (response) {
                            debug.log(response);

                            if (response.success) {
                                notification.addNotification({
                                    message: 'Updated!',
                                    type   : "success",
                                });

                                // Load attempts.
                                canvas_module.load_history();

                            } else {
                                notification.addNotification({
                                    message: response.error,
                                    type   : "error"
                                });
                            }
                        },
                        error   : function (response) {
                            debug.error(response.responseText);
                            // Show a error messages.
                            notification.addNotification({
                                message: response.responseText,
                                type   : "error"
                            });
                        }
                    });
                }
            });
        },

        /**
         * Set active element colors.
         * @param color
         */
        set_color: function (color) {

            let colorhex = color.toHexString(); // #ff0000
            let activeobjs = canvas.getActiveObject();
            if (activeobjs) {
                activeobjs.set("fill", colorhex);
                canvas.renderAll();
            } else {
                debug.log('No active items');
            }
        },

        /**
         * Don't allow going out of canvas.
         */
        prevent_moving_out_of_canvas: function () {
            canvas.on('object:moving', function (e) {
                let obj = e.target;
                // if object is too big ignore
                if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
                    return;
                }
                obj.setCoords();

                if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
                    obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
                    obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
                }

                if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height ||
                    obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
                    obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top -
                        obj.getBoundingRect().top);
                    obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left -
                        obj.getBoundingRect().left);
                }
            });
        },

        /**
         * Start this module.
         */
        init: function () {

            // Load canvas.
            this.__canvas = canvas = new fabric.Canvas('sketch');
            fabric.Object.prototype.transparentCorners = false;

            // Dimensions.
            canvas.setHeight(this.canvas_height);
            canvas.setWidth(this.canvas_width);

            // Catch some actions.
            canvas.on({
                'selection:created': this.onchange,
                'selection:updated': this.onchange,
            });

            this.prevent_moving_out_of_canvas();

            this.load_toolbar();

            this.add_horizontal_ruler();

            this.load_history();
        },

        /**
         * Horizontal ruler.
         */
        add_horizontal_ruler: function () {
            let ruler = new fabric.Rect({
                width : this.canvas_width,
                height: 2,
                left  : 0,
                top   : this.canvas_height / 2,
                angle : 0,
                fill  : '#5c5c5c'
            });

            ruler.flipY = false;
            ruler.lockMovementX = true;
            ruler.lockScalingX = true;
            ruler.lockScalingY = true;
            ruler.lockUniScaling = true;
            ruler.lockRotation = true;

            canvas.add(ruler);
            canvas.renderAll();

            // Keyboard arrows move ruler.
            $(document).keydown(function (e) {
                switch (e.which) {

                    case 38: // Up arrow.
                        ruler.top = ruler.top - 10;
                        canvas.renderAll();
                        break;

                    case 40: // Down arrow.
                        ruler.top = ruler.top + 10;
                        canvas.renderAll();

                        break;

                    default:
                        return; // exit this handler for other keys
                }
                e.preventDefault(); // prevent the default action (scroll / move caret)
            });
        },

        /**
         * Trigger on canvas element actions.
         * @param options
         */
        onchange: function (options) {
            $("#colorpicker").spectrum("set", options.target.fill);
        }
    };

    return {

        /**
         * Init.
         */
        initialise: function (args) {

            // Load the args passed from PHP.
            set_options(args);

            // Set internal debug console.
            set_debug(opts.debugjs);

            $.noConflict();
            $(document).ready(function () {
                debug.log('Canvas Module v1.0');
                canvas_module.init();
            });
        }
    };
});