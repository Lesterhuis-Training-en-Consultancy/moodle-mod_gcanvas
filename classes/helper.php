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
 * @package   moodle-mod_gcanvas
 * @copyright 9-10-2018 MoodleFreak.com
 * @author    Luuk Verhoeven
 **/

namespace mod_gcanvas;
defined('MOODLE_INTERNAL') || die;

class helper {

    /**
     * We are in DEBUG mode display more info than general.
     *
     * @return bool
     */
    public static function has_debugging_enabled() {
        global $CFG;

        // Check if the environment has debugging enabled.
        return ($CFG->debug >= 32767 && $CFG->debugdisplay == 1);
    }

    /**
     * Get images
     *
     * @param string    $filearea
     * @param           $context
     * @param int       $canvasid
     *
     * @param int       $limit
     *
     * @return array
     * @throws \coding_exception
     */
    public static function get_images(string $filearea, $context, int $canvasid, int $limit = 1) : array {
        global $CFG;
        $list = [];

        $fs = get_file_storage();
        $files = $fs->get_area_files($context->id, 'mod_gcanvas', $filearea, $canvasid, 'id', false, 0 ,
            0 , $limit);

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
     * Get file options
     *
     * @param $context
     *
     * @return array
     */
    public static function get_file_options($context) {

        global $CFG;

        return [
            'subdirs' => 0,
            'maxfiles' => 50,
            'maxbytes' => $CFG->maxbytes,
            'accepted_types' => '*',
            'context' => $context,
            'return_types' => 2 | 1,
        ];
    }

}