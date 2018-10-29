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
                    if (response.success) {
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
         *  Save the current canvas.
         */
        save_canvas_ajax: function () {
            // Canvas to image.
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
        },

        /**
         * Trash selected canvas items.
         */
        delete_selected_canvas_items: function () {
            try {
                let activeobjects = canvas.getActiveObjects();
                canvas.discardActiveObject();
                if (activeobjects.length) {
                    canvas.remove.apply(canvas, activeobjects);
                }
            } catch (e) {
                debug.error('Nothing selected', e);
            }
        },

        /**
         *
         */
        load_dynamic_toolbar_mapping_shapes: function () {

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
        },

        /**
         *
         */
        load_color_picker: function () {
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
        },

        /**
         * Using svg making sure it looks nice.
         *
         * @param src
         */
        load_emoji_csv    : function (src) {
            debug.log('load_emoji_csv : ', src);
            // Issue when using loadsvgfromurl.
            fabric.Image.fromURL(src.replace('.png', '.svg'), function (object) {
                object.set({
                    height         : 500,
                    width          : 500,
                    left           : 150,
                    top            : 100,
                    angle          : 0,
                    centerTransform: true
                }).scale(0.4)
                    .setCoords();
                canvas.add(object);
                canvas.setActiveObject(object);
            });
        },

        /**
         * Toolbar actions.
         */
        load_toolbar: function () {

            // Most shapes will be placed on canvas by this function.
            this.load_dynamic_toolbar_mapping_shapes();

            // Color picker.
            this.load_color_picker();

            // Clear canvas items.
            $('#clear').on('click', function () {
                canvas.clear();
                canvas_module.add_horizontal_ruler();
            });

            // Arrow.
            $('#arrow i').on('click', function () {
                canvas_module.load_arrow_to_canvas();
            });

            // Remove selected items.
            $('#trash i').on('click', function (e) {
                canvas_module.delete_selected_canvas_items();
            });

            // Load emoji picker.
            $('#smiley i').on('click', function () {
                canvas_module.load_emoji_picker();
            });

            $('#add-image i').on('click', function () {
                canvas_module.load_image_uploader();
            });

            $('#save-canvas').on('click', function () {
                canvas_module.save_canvas_ajax();
            });

            $('#emoji-picker').on('click', 'img', function () {
                canvas_module.load_emoji_csv($(this).attr('src'));
                $('#emoji-picker').hide();
            });
        },

        /**
         *
         */
        load_emoji_picker: function () {
            // @TODO add emoji picker.
            let $picker = $('#emoji-picker');
            if ($picker.html() != '') {
                debug.log('Toggle emoji');
                $picker.toggle();
                return;
            }

            $.ajax({
                type    : 'POST',
                url     : M.cfg.wwwroot + '/mod/gcanvas/ajax.php',
                data    : {
                    sesskey: M.cfg.sesskey,
                    action : 'emoji',
                    data   : {
                        'id': opts.id,
                    }
                },
                dataType: "json",
                success : function (response) {
                    debug.log(response);

                    if (response.success) {
                        $picker.html(response.html).show();
                    }
                }
            });
        },

        /**
         *
         */
        load_image_uploader: function () {
            // @TODO upload own images.

            fabric.Image.fromURL('pix/ladybug.png', function (obj) {
                obj.set('left', fabric.util.getRandomInt(200, 600)).set('top', -50);
                canvas.add(obj);
            });
        },

        /**
         * Load the arrow icon to the canvas.
         */
        load_arrow_to_canvas: function () {
            fabric.loadSVGFromURL('pix/arrow.svg', function (objects, options) {
                let obj = fabric.util.groupSVGElements(objects, options);
                canvas.add(obj.scale(0.1)).centerObject(obj).renderAll();
                obj.setCoords();
                canvas.setActiveObject(obj);
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
         * Trigger for extra keyboard commands.
         */
        keyboard_actions: function () {
            $(document).keydown(function (e) {
                debug.log('keypress', e.which);
                switch (e.which) {
                    case 46:
                        canvas_module.delete_selected_canvas_items();
                        break;
                }
            });
        },

        /**
         * Start this module.
         */
        init: function () {

            // Load canvas.
            this.__canvas = canvas = new fabric.Canvas('sketch');
            // fabric.Object.prototype.transparentCorners = false;
            // fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

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

            this.keyboard_actions();
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
                fill  : '#000'
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