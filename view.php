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
 * Prints an instance of mod_gcanvas.
 *
 * @package     mod_gcanvas
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require(__DIR__ . '/../../config.php');
require_once(__DIR__ . '/lib.php');
require_once(__DIR__ . "/../../repository/lib.php");
require_once("$CFG->libdir/filelib.php");

defined('MOODLE_INTERNAL') || die;

// Course_module ID.
$id = optional_param('id', 0, PARAM_INT);
$g = optional_param('g', 0, PARAM_INT);
$action = optional_param('action', '', PARAM_ALPHA);

if ($id) {
    $cm = get_coursemodule_from_id('gcanvas', $id, 0, false, MUST_EXIST);
    $course = $DB->get_record('course', ['id' => $cm->course], '*', MUST_EXIST);
    $moduleinstance = $DB->get_record('gcanvas', ['id' => $cm->instance], '*', MUST_EXIST);
} else if ($g) {
    $moduleinstance = $DB->get_record('gcanvas', ['id' => $n], '*', MUST_EXIST);
    $course = $DB->get_record('course', ['id' => $moduleinstance->course], '*', MUST_EXIST);
    $cm = get_coursemodule_from_instance('gcanvas', $moduleinstance->id, $course->id, false, MUST_EXIST);
} else {
    print_error(get_string('missingidandcmid', mod_gcanvas));
}

require_login($course, true, $cm);

$modulecontext = context_module::instance($cm->id);

$event = \mod_gcanvas\event\course_module_viewed::create([
    'objectid' => $moduleinstance->id,
    'context' => $modulecontext,
]);
$event->add_record_snapshot('course', $course);
$event->add_record_snapshot('gcanvas', $moduleinstance);
$event->trigger();

//$PAGE->requires->css('/mod/gcanvas/styles.css');
$PAGE->requires->css('/mod/gcanvas/css/spectrum.css');
$PAGE->set_url('/mod/gcanvas/view.php', [
    'id' => $cm->id,
    'action' => $action,
    'g' => $g,
]);
$PAGE->set_title(format_string($moduleinstance->name));
$PAGE->set_heading(format_string($course->fullname));
$PAGE->set_context($modulecontext);

/** @var mod_gcanvas_renderer $renderer * */
$renderer = $PAGE->get_renderer('mod_gcanvas');
$renderer->add_javascript_helper($moduleinstance);

// Handle file uploads directly.
if (($data = data_submitted()) && confirm_sesskey()) {

    // TODO Protect uploading filearea.

    $filearea = $data->filearea;
    file_save_draft_area_files($data->$filearea,
        $modulecontext->id,
        'mod_gcanvas',
        $filearea,
        $moduleinstance->id,
        \mod_gcanvas\helper::get_file_options($modulecontext));

    // Prevent resubmission.
    redirect($PAGE->url);
}

switch ($action) {

    case 'intro':

        break;

    default:
        echo $OUTPUT->header();
        echo $renderer->render_canvas();
        echo $renderer->render_uploader('background', $moduleinstance);
        echo $renderer->render_uploader('student_image', $moduleinstance);
        echo $renderer->render_uploader('toolbar_shape', $moduleinstance);
        echo $OUTPUT->footer();
}

