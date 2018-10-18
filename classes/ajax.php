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
 * Ajax calls.
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   moodle-mod_gcanvas
 * @copyright 9-10-2018 MoodleFreak.com
 * @author    Luuk Verhoeven
 **/

namespace mod_gcanvas;

use context_module;
use file_storage;
use mod_gcanvas\output\output_canvas_attempts;

defined('MOODLE_INTERNAL') || die;

class ajax {
    /**
     * @var mixed
     */
    private $data;

    /**
     * ajax constructor.
     *
     * @param mixed $data
     */
    public function __construct($data) {
        // default stuff.
        $this->data = (object)$data;
    }

    /**
     * Get user there history attempts.
     *
     * @return array
     * @throws \coding_exception
     * @throws \dml_exception
     * @throws \moodle_exception
     * @throws \require_login_exception
     */
    public function callable_load_history() {
        global $DB, $PAGE, $OUTPUT;
        $cm = get_coursemodule_from_id('gcanvas', $this->data->id, 0, false,
            MUST_EXIST);
        $course = $DB->get_record('course', ['id' => $cm->course], '*',
            MUST_EXIST);

        require_login($course, true, $cm);

        $renderer = $PAGE->get_renderer('mod_gcanvas');

        return [
            'html' => $renderer->render_from_template('mod_gcanvas/canvas_attempts',
                (new output_canvas_attempts($this->data->id))
                ->export_for_template($OUTPUT)),
            'success' => true,
        ];
    }

    /**
     * Save student there canvas to a attempt
     *
     * @return array
     * @throws \coding_exception
     * @throws \dml_exception
     * @throws \file_exception
     * @throws \moodle_exception
     * @throws \require_login_exception
     * @throws \stored_file_creation_exception
     */
    public function callable_save_canvas() {
        global $DB, $USER;
        $fileid = 0;
        $cm = get_coursemodule_from_id('gcanvas', $this->data->id, 0, false,
            MUST_EXIST);
        $course = $DB->get_record('course', ['id' => $cm->course], '*',
            MUST_EXIST);

        require_login($course, true, $cm);

        $imagecontent = base64_decode(preg_replace('#^data:image/\w+;base64,#i',
            '', $this->data->canvas_data));

        if (!empty($imagecontent)) {
            $attemptid = $DB->insert_record('gcanvas_attempt', (object)[
                'status' => $this->data->status,
                'user_id' => $USER->id,
                'gcanvas_id' => $cm->instance,
                'json_data' => $this->data->json_data,
                'added_on' => time(),
            ]);

            // Create the image.
            $modulecontext = context_module::instance($cm->id);
            $fs = new file_storage();
            $fileid = $fs->create_file_from_string((object)[
                'contextid' => $modulecontext->id,
                'component' => 'mod_gcanvas',
                'filearea' => 'attempt',
                'itemid' => $attemptid,
                'filepath' => '/',
                'filename' => time() . '.png',
                'userid' => $USER->id,
            ], $imagecontent);
        }

        return [
            'success' => true,
            'file_id' => $fileid,
        ];
    }

}