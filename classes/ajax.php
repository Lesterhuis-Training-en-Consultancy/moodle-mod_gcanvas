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
 * TODO convert to external webservices more native Moodle, for now this is less complex.
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   mod_gcanvas
 * @copyright 9-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

namespace mod_gcanvas;

use context_module;
use dml_exception;
use file_storage;

defined('MOODLE_INTERNAL') || die;

/**
 * Class ajax
 *
 * @package     mod_gcanvas
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
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
        $this->data = (object)$data;
    }

    /**
     * Get user there history attempts.
     *
     * @return array
     */
    public function callable_load_history() : array {
        global $PAGE;

        $renderer = $PAGE->get_renderer('mod_gcanvas');

        return [
            'html' => $renderer->render_attempts($this->data->id),
            'success' => true,
        ];
    }

    /**
     * Save student there canvas to a attempt
     *
     * @return array
     * @throws dml_exception
     * @throws \file_exception
     * @throws \stored_file_creation_exception
     */
    public function callable_save_canvas() : array {
        global $DB, $USER;
        $fileid = 0;
        $cobject = $this->load_cm_and_course();
        $imagecontent = base64_decode(preg_replace('#^data:image/\w+;base64,#i',
            '', $this->data->canvas_data));

        if (!empty($imagecontent)) {
            $attemptid = $DB->insert_record('gcanvas_attempt', (object)[
                'status' => $this->data->status,
                'user_id' => $USER->id,
                'gcanvas_id' => $cobject->cm->instance,
                'json_data' => $this->data->json_data,
                'added_on' => time(),
            ]);

            // Create the image.
            $modulecontext = context_module::instance($cobject->cm->id);
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

    /**
     * Load emoji html
     *
     * @return array
     * @throws \moodle_exception
     */
    public function callable_emoji() : array {
        global $PAGE, $CFG;

        $renderer = $PAGE->get_renderer('mod_gcanvas');

        return [
            'html' => $renderer->render_from_template('mod_gcanvas/canvas_emoji', (object)[
                'wwwroot' => $CFG->wwwroot,
            ]),
            'success' => true,
        ];
    }

    /**
     * Delete a attempt
     *
     * @return array
     * @throws dml_exception
     */
    public function callable_delete_attempt() : array {
        global $USER, $DB;

        $DB->delete_records('gcanvas_attempt', [
            'user_id' => $USER->id,
            'id' => $this->data->attempt_id,
        ]);

        return ['success' => true];
    }

    /**
     * Delete a attempt
     *
     * @return array
     * @throws dml_exception
     */
    public function callable_get_attempt() : array {
        global $USER, $DB;

        $record = $DB->get_record('gcanvas_attempt', [
            'user_id' => $USER->id,
            'id' => $this->data->attempt_id ?? 0,
        ]);

        return [
            'success' => true,
            'record' => $record,
        ];
    }

    /**
     * Upload images
     *
     * @throws \coding_exception
     * @throws \moodle_exception
     * @throws \required_capability_exception
     */
    public function callable_upload_images() : array {
        $filearea = $this->data->filearea;
        $image = helper::upload_file($filearea, $this->data->$filearea);

        return [
            'success' => true,
            'image' => $image,
        ];
    }

    /**
     * Get toolbar images
     *
     * @throws \coding_exception
     * @throws \moodle_exception
     */
    public function callable_get_toolbar_images() : array {
        $cobject = $this->load_cm_and_course();
        $modulecontext = context_module::instance($cobject->cm->id);

        return [
            'success' => true,
            'images' => helper::get_images('toolbar_shape', $modulecontext, $cobject->cm->instance, 100),
        ];
    }

    /**
     * load_cm_and_course
     *
     * @return object
     */
    protected function load_cm_and_course() : object {
        global $PAGE;

        return (object)[
            'course' => $PAGE->course,
            'cm' => $PAGE->cm,
        ];
    }

}