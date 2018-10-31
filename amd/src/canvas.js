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
 * @copyright 2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/
/* eslint no-unused-expressions: "off"  no-console: ["error", { allow: ["warn", "error" , "log"] }] */
define(['jquery', 'core/notification', 'mod_gcanvas/spectrum', "mod_gcanvas/fabric"], function ($, notification, mod1, fabric) {
    'use strict';

    /**
     * Possible options
     * @type {{id: number, debugjs: boolean, has_horizontal_ruler: boolean, background: string}}
     */
    var opts = {
        id                  : 0,
        debugjs             : false,
        has_horizontal_ruler: true,
        background          : '',
    };

    /**
     * Set options base on listed options
     * @param {object} options
     */
    var set_options = function (options) {
        "use strict";
        var key, vartype;
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
    var debug = {};

    /**
     * Set debug mode
     * Should only be enabled if site is in debug mode.
     * @param {boolean} isenabled
     */
    var set_debug = function (isenabled) {

        if (isenabled) {
            for (var m in console) {
                if (typeof console[m] == 'function') {
                    debug[m] = console[m].bind(window.console);
                }
            }
        } else {
            // Fake wrapper.
            for (var m in console) {
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
    var canvas = null;

    /**
     * Module canvas wrapper.
     */
    var canvas_module = {

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
                var activeobjects = canvas.getActiveObjects();
                if (activeobjects.length) {

                    for (var i in activeobjects) {
                        if (activeobjects.hasOwnProperty(i)) {
                            var element = activeobjects[i];

                            if (element.id !== undefined && element.id === 'ruler') {
                                debug.log('Ruler: Not removable!');
                                continue;
                            }

                            canvas.remove(element);
                        }
                    }

                    canvas.discardActiveObject().renderAll();
                }else{
                    debug.log('Selection empty');
                }

            } catch (e) {
                debug.error('Nothing selected', e);
            }
        },

        /**
         * Dynamic method for selecting a shape.
         */
        load_dynamic_toolbar_mapping_shapes: function () {

            $('#toolbar .icon[data-element-type]').on('click', function () {

                var elementtype = $(this).data('element-type');

                try {
                    canvas.discardActiveObject();
                } catch (e) {
                    // If nothing is added to the canvas this gives a error.
                }

                var shape = "default_shape_" + elementtype.toLowerCase();
                debug.log("Search for shape: " + shape);

                if (canvas_module.hasOwnProperty(shape)) {
                    debug.log("Shape found");

                    var el = new fabric[elementtype](canvas_module[shape]);

                    canvas.add(el);
                    canvas.setActiveObject(el);
                } else {
                    debug.error('Shape not found!');
                }

                canvas.renderAll();
            });
        },

        /**
         * Colorpicker used for changing the color of a shape.
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
        load_emoji_csv: function (src) {
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
         * Delete a attempt/sketch
         *
         * @param {jQuery} $el
         */
        delete_attempt: function ($el) {
            //TODO we could better use amd Ajax helper Moodle and external webservice, for now this is okay.

            debug.log('Delete', $el);
            notification.confirm(
                M.util.get_string('javascript:confirm_title', 'mod_gcanvas'),
                M.util.get_string('javascript:confirm_desc', 'mod_gcanvas'),
                M.util.get_string('javascript:yes', 'mod_gcanvas'),
                M.util.get_string('javascript:no', 'mod_gcanvas'), function () {

                    $.ajax({
                        type    : 'POST',
                        url     : M.cfg.wwwroot + '/mod/gcanvas/ajax.php',
                        data    : {
                            sesskey: M.cfg.sesskey,
                            action : 'delete_attempt',
                            data   : {
                                'id'        : opts.id,
                                'attempt_id': $el.data('id'),
                            }
                        },
                        dataType: "json",
                        success : function (response) {
                            debug.log(response);

                            if (response.success) {
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
                });
        },

        /**
         * Restore a attempt/sketch
         *
         * @param {jQuery} $el
         */
        restore_attempt: function ($el) {
            debug.log('Restore', $el);
            $.ajax({
                type    : 'POST',
                url     : M.cfg.wwwroot + '/mod/gcanvas/ajax.php',
                data    : {
                    sesskey: M.cfg.sesskey,
                    action : 'get_attempt',
                    data   : {
                        'id'        : opts.id,
                        'attempt_id': $el.data('id'),
                    }
                },
                dataType: "json",
                success : function (response) {
                    debug.log(response);

                    if (response.success) {
                        canvas.loadFromJSON(response.record.json_data, canvas.renderAll.bind(canvas));
                    }
                }
            });
        },

        /**
         * Show the fileuploader.
         *
         * @param filearea
         */
        show_fileuploader: function (filearea) {
            $('#canvas-filepicker-form-' + filearea).toggle();
        },

        /**
         * Set background of the canvas.
         */
        set_background_image: function () {

            if (opts.background !== '') {
                fabric.Image.fromURL(opts.background, function (img) {
                    // add background image
                    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                        scaleX: canvas.width / img.width,
                        scaleY: canvas.height / img.height
                    });
                });
            }
        },

        /**
         * Toolbar actions.
         */
        load_toolbar: function () {

            this.set_background_image();

            // Most shapes will be placed on canvas by this function.
            this.load_dynamic_toolbar_mapping_shapes();

            // Color picker.
            this.load_color_picker();

            // Clear canvas items.
            $('#clear').on('click', function () {
                canvas.clear();

                if (opts.has_horizontal_ruler) {
                    canvas_module.add_horizontal_ruler();
                }

                canvas_module.set_background_image();
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
                canvas_module.show_fileuploader('student_image');
            });

            $('#save-canvas').on('click', function () {
                canvas_module.save_canvas_ajax();
            });

            $('#history').on('click', '.delete', function (e) {
                e.preventDefault();
                canvas_module.delete_attempt($(this));

            }).on('click', '.restore', function (e) {

                e.preventDefault();
                canvas_module.restore_attempt($(this));

            });

            $('#emoji-picker').on('click', 'img', function () {
                canvas_module.load_emoji_csv($(this).attr('src'));
                $('#emoji-picker').hide();
            });

            $('#change_background').on('click', function () {
                canvas_module.show_fileuploader('background');
            });

            $('#add_toolbar_images').on('click', function () {
                canvas_module.show_fileuploader('toolbar_shape');
            });

            // Hide pressing on cancel.
            $('#page').on('click', '.btn-secondary', function (e) {
                e.preventDefault();
                debug.log('Cancel');
                $('.dialog').hide();
            });
        },

        /**
         * Emoji dialog
         */
        load_emoji_picker: function () {
            var $picker = $('#emoji-picker');
            if ($picker.html() !== '') {
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
         * Load the arrow icon to the canvas.
         */
        load_arrow_to_canvas: function () {
            fabric.loadSVGFromURL('pix/arrow.svg', function (objects, options) {
                var obj = fabric.util.groupSVGElements(objects, options);
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

            var colorhex = color.toHexString(); // #ff0000
            var activeobjs = canvas.getActiveObject();
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
                var obj = e.target;
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

            if (opts.has_horizontal_ruler) {
                this.add_horizontal_ruler();
            }

            this.load_history();

            this.keyboard_actions();
        },

        /**
         * Horizontal ruler.
         */
        add_horizontal_ruler: function () {
            var ruler = new fabric.Rect({
                width : this.canvas_width,
                height: 2,
                id    : 'ruler',
                left  : 0,
                top   : this.canvas_height / 2,
                angle : 0,
                fill  : '#8B58A1'
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
                        return; // Exit this handler for other keys.
                }
                e.preventDefault(); // Prevent the default action (scroll / move caret).
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