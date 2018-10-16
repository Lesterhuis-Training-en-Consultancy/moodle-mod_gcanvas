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
         * Toolbar actions.
         */
        load_toolbar: function () {

            $('#toolbar .icon').click(function () {

                let elementtype = $(this).data('element-type');

                try {
                    canvas.discardActiveObject();
                } catch (e) {
                    // if nothing is added this gives a error.
                }

                let shape = "default_shape_" + elementtype.toLowerCase();
                console.log("Search for shape: " + shape);

                if (elementtype === 'Arrow') {
                    fabric.loadSVGFromURL('pix/arrow.svg', function (objects, options) {

                        var shape = fabric.util.groupSVGElements(objects, options);
                        canvas.add(shape.scale(0.1));
                        shape.set({
                            left: 200,
                            top : 100
                        }).setCoords();
                        canvas.renderAll();

                        canvas.forEachObject(function (obj) {
                            var setCoords = obj.setCoords.bind(obj);
                            obj.on({
                                moving  : setCoords,
                                scaling : setCoords,
                                rotating: setCoords
                            });
                        })
                    });
                } else if (canvas_module.hasOwnProperty(shape)) {
                    console.log("Shape found");

                    let el = new fabric[elementtype](canvas_module[shape]);

                    canvas.add(el);
                    canvas.setActiveObject(el);
                } else {
                    console.error('Shape not found!');
                }

                canvas.requestRenderAll();
            });
        },

        /**
         * Don't allow going out of canvas.
         */
        prevent_moving_out_of_canvas: function () {
            canvas.on('object:moving', function (e) {
                var obj = e.target;
                // if object is too big ignore
                if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
                    return;
                }
                obj.setCoords();

                if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
                    obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
                    obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
                }

                if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height ||
                    obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
                    obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-
                        obj.getBoundingRect().top);
                    obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-
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
                'object:moving'  : this.onchange,
                'object:scaling' : this.onchange,
                'object:rotating': this.onchange,
            });

            this.prevent_moving_out_of_canvas();

            this.load_toolbar();

            this.add_horizontal_ruler();
        },

        /**
         * Horizontal ruler.
         */
        add_horizontal_ruler: function () {
            let ruler = new fabric.Rect({
                width : this.canvas_width,
                height: 1,
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
            canvas.requestRenderAll();

            // Keyboard arrows move ruler.
            $(document).keydown(function(e) {
                switch(e.which) {

                    case 38: // Up arrow.
                        ruler.top =  ruler.top - 10;
                        canvas.requestRenderAll();
                        break;

                    case 40: // Down arrow.
                        ruler.top =  ruler.top + 10;
                        canvas.requestRenderAll();

                        break;

                    default: return; // exit this handler for other keys
                }
                e.preventDefault(); // prevent the default action (scroll / move caret)
            });
        },

        /**
         * Trigger on canvas element actions.
         * @param options
         */
        onchange: function (options) {
            // options.target.setCoords();
            //
            // canvas.forEachObject(function (obj) {
            //     if (obj === options.target) {
            //         return;
            //     }
            //     obj.set('opacity', options.target.intersectsWithObject(obj) ? 0.5 : 1);
            // });
        }
    };

    return {

        /**
         * Init.
         */
        initialise: function (args) {
            console.log('Canvas Module v1.0');
            $.noConflict();
            $(document).ready(function () {
                console.log('Canvas Module v1.0');
                canvas_module.init();
            });
        }
    };
});