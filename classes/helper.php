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
 * Helper class
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   mod_gcanvas
 * @copyright 9-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

namespace mod_gcanvas;

use coding_exception;
use moodle_exception;
use required_capability_exception;

defined('MOODLE_INTERNAL') || die;

/**
 * Class helper
 *
 * @package     mod_gcanvas
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class helper {

    /**
     * We are in DEBUG mode display more info than general.
     *
     * @return bool
     */
    public static function has_debugging_enabled() : bool {
        global $CFG;

        // Check if the environment has debugging enabled.
        return ($CFG->debug >= 32767 && $CFG->debugdisplay == 1);
    }

    /**
     * Get images
     *
     * @param string    $filearea
     * @param \stdClass $context
     * @param int       $canvasid
     * @param int       $limit
     *
     * @return array
     * @throws coding_exception
     */
    public static function get_images(string $filearea, $context, int $canvasid, int $limit = 1) : array {
        global $CFG;
        $list = [];

        $fs = get_file_storage();
        $files = $fs->get_area_files($context->id, 'mod_gcanvas', $filearea, $canvasid, 'id DESC', false, 0,
            0, $limit);

        foreach ($files as $file) {
            if ($file->is_valid_image()) {
                $list[] = file_encode_url("$CFG->wwwroot/pluginfile.php",
                    '/' . $file->get_contextid() . '/' . $file->get_component() . '/' .
                    $file->get_filearea() . $file->get_filepath() . $file->get_itemid() . '/' . $file->get_filename());
            }
        }

        return $list;
    }

    /**
     * Upload file
     *
     * @param string $filearea
     * @param int    $fileareaid
     *
     * @return string
     * @throws coding_exception
     * @throws moodle_exception
     * @throws required_capability_exception
     */
    public static function upload_file(string $filearea, int $fileareaid) : string {
        global $PAGE;

        switch ($filearea) {
            case 'background':
            case 'toolbar_shape':
                require_capability('mod/gcanvas:teacher', $PAGE->context);
                break;
            case 'student_image':
                require_capability('mod/gcanvas:student_image', $PAGE->context);
                break;
            default:
                throw new moodle_exception('Unknown filearea');
        }

        $return = file_save_draft_area_files($fileareaid,
            $PAGE->context->id,
            'mod_gcanvas',
            $filearea,
            $PAGE->cm->instance,
            self::get_file_options($PAGE->context), 'FILE');

        // Return file.
        if ($return) {
            $images = self::get_images($filearea, $PAGE->context, $PAGE->cm->instance, 1);

            return reset($images);
        }

        return '';
    }

    /**
     * Get file options
     *
     * @param \stdClass $context
     * @param int       $max
     *
     * @return array
     */
    public static function get_file_options($context, int $max = 50) : array {
        global $CFG;

        return [
            'subdirs' => 0,
            'maxfiles' => $max,
            'maxbytes' => $CFG->maxbytes,
            'accepted_types' => 'web_image',
            'context' => $context,
        ];
    }

}