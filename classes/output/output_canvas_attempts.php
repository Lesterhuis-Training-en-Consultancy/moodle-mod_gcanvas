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
 * Output class for the canvas.
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   mod_gcanvas
 * @copyright 9-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

namespace mod_gcanvas\output;
defined('MOODLE_INTERNAL') || die;

use coding_exception;
use context_module;
use dml_exception;
use renderable;
use renderer_base;
use stdClass;
use templatable;

/**
 * Class output_canvas_attempts
 *
 * @package     mod_gcanvas
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class output_canvas_attempts implements renderable, templatable {

    /**
     * @var int
     */
    protected $id;

    /**
     * @var stdClass
     */
    protected $cm;

    /**
     * @var context_module
     */
    protected $context;

    /**
     * output_canvas_attempts constructor.
     *
     * @param int $id
     *
     * @throws coding_exception
     */
    public function __construct(int $id) {
        $this->id = $id;
        $this->cm = get_coursemodule_from_id('gcanvas', $this->id, 0, false,
            MUST_EXIST);
        $this->context = context_module::instance($this->cm->id);

    }

    /**
     * Get attempt items
     *
     * @return array
     * @throws dml_exception
     * @throws coding_exception
     */
    protected function get_items() : array {
        global $DB, $USER;

        $list = [];
        $rs = $DB->get_recordset('gcanvas_attempt', [
            'user_id' => $USER->id,
            'status' => 'final',
            'gcanvas_id' => $this->cm->instance,
        ], 'added_on DESC');

        foreach ($rs as $row) {
            $src = $this->get_image($row);

            if (empty($src)) {
                continue;
            }

            $list[] = [
                'added_on' => date('d-m-Y H:i', $row->added_on),
                'id' => $row->id,
                'src' => $src,
            ];
        }

        $rs->close();

        return $list;
    }

    /**
     * Get image
     *
     * @param stdClass $row
     *
     * @return string
     * @throws coding_exception
     */
    public function get_image(\stdClass $row) : string {
        global $CFG;
        $fs = get_file_storage();
        $files = $fs->get_area_files(
            $this->context->id,
            'mod_gcanvas',
            'attempt',
            $row->id,
            'id',
            false
        );

        foreach ($files as $file) {
            $isimage = $file->is_valid_image();
            if ($isimage) {
                return file_encode_url("$CFG->wwwroot/pluginfile.php",
                    '/' . $file->get_contextid() . '/' . $file->get_component() . '/' .
                    $file->get_filearea() . $file->get_filepath() . $file->get_itemid() . '/' . $file->get_filename());
            }
        }

        return '';
    }

    /**
     * Function to export the renderer data in a format that is suitable for a
     * mustache template. This means:
     * 1. No complex types - only stdClass, array, int, string, float, bool
     * 2. Any additional info that is required for the template is pre-calculated (e.g. capability checks).
     *
     * @param renderer_base $output Used to do a final render of any components that need to be rendered for export.
     *
     * @return stdClass|array
     * @throws dml_exception
     * @throws coding_exception
     */
    public function export_for_template(renderer_base $output) : stdClass {

        $data = $this->get_items();

        $object = new stdClass();
        $object->attempts = array_values($data);

        return $object;
    }

}