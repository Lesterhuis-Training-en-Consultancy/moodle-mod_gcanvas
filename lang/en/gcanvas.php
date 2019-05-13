<?php
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
 * Plugin EN strings are defined here.
 *
 * @package     mod_gcanvas
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();
// Init.
$string['pluginname'] = 'Canvas game';
$string['modulename'] = 'Canvas game';
$string['modulename_help'] = 'The canvas game is design to give students the possibility to gain more insight in their situation and creating strategies by using the drawing tools of the canvas game. A student can save, download or reuse the canvas as many times as they want. The Canvas game does not support teacher feedback or grading. ';

$string['modulenameplural'] = 'Canvas game';
$string['pluginadministration'] = 'Canvas game administration';
$string['teacher_tools'] = 'Teacher tools';

$string['gcanvas:addinstance'] = 'Add a new canvas game instance';
$string['gcanvas:view'] = 'View canvas game';
$string['gcanvas:teacher'] = 'Canvas teacher can change the canvas properties';
$string['gcanvas:student_image'] = 'Allows student to upload files';

// Form.
$string['form:gcanvasname'] = 'Canvas name';
$string['form:has_horizontal_ruler'] = 'Show horizontal ruler';
$string['form:has_horizontal_ruler_desc'] = 'Add a horizontal ruler to the canvas, can be moved with your keyboard arrow keys';
$string['form:attachment'] = 'Attachment';
$string['form:helptext'] = 'Help text';

// Buttons.
$string['btn:text'] = 'Press this icon to place a text';
$string['btn:save'] = 'Save canvas';
$string['btn:clear'] = 'Clear all';
$string['btn:samples'] = 'Show intro';
$string['btn:image'] = 'Add your own image to the canvas';
$string['btn:trash'] = 'Selected items will be removed from canvas';
$string['btn:arrow'] = 'Press this icon to place a arrow';
$string['btn:circle'] = 'Press this icon to place a circle';
$string['btn:rect'] = 'Press this icon to place a rectangle';
$string['btn:triangle'] = 'Press this icon to place a triangle';
$string['btn:smiley'] = 'Press this icon to place a smiley';
$string['btn:select_a_image'] = 'Press this icon to select a image';
$string['btn:remove'] = 'Remove your sketch';
$string['btn:restore'] = 'Restore your sketch';
$string['btn:download'] = 'Download your sketch';
$string['btn:save_file'] = 'Upload';
$string['btn:background'] = 'Background';
$string['btn:toolbar_images'] = 'Toolbar images';
$string['btn:help'] = 'Help';
$string['btn:intro'] = 'Edit help text';
$string['btn:submit'] = 'Submit';
$string['btn:undo'] = 'Undo';
$string['btn:colorpicker'] = 'Colorpicker';

// Javascript.
$string['javascript:confirm_title'] = 'Confirm deletion of your sketch';
$string['javascript:confirm_desc'] = 'Are you sure to delete this sketch?';
$string['javascript:yes'] = 'Yes';
$string['javascript:no'] = 'No';
$string['javascript:updated'] = 'Updated!';

$string['privacy:metadata:attempt'] = 'Information about the user\'s attempts for a given gcanvas activity';
$string['privacy:metadata:attempt:gcanvas'] = 'The gcanvas module ID';
$string['privacy:metadata:attempt:json_data'] = 'The attempt data, this is stored in json format';
$string['privacy:metadata:attempt:added_on'] = 'The timestamp indicating when the attempt is saved';
