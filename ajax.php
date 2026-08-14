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
 * Ajax calls router.
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   mod_gcanvas
 * @copyright 9-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

// AJAX_SCRIPT and NO_DEBUG_DISPLAY must be defined before config.php is included.
define('AJAX_SCRIPT', true);
define('NO_DEBUG_DISPLAY', true);

require_once(__DIR__ . '/../../config.php');
defined('MOODLE_INTERNAL') || die;

$action = optional_param('action', '', PARAM_TEXT);
$data = optional_param('data', '', PARAM_RAW);

// Reject malformed payloads before touching any field on the decoded object (LS-4206).
$decoded = json_decode($data, true);
if (!is_array($decoded) || empty($decoded['id'])) {
    throw new moodle_exception('invalidrequest', 'error');
}
$data = (object) $decoded;

// Set course and context.
$cm = get_coursemodule_from_id('gcanvas', (int) $data->id, 0, false, MUST_EXIST);
$course = $DB->get_record('course', ['id' => $cm->course], '*', MUST_EXIST);

$PAGE->set_context(context_module::instance($cm->id));
$PAGE->set_cm($cm);

// First validation access.
require_login($course, true, $cm);
$PAGE->set_course($course);

// Confirm session.
require_sesskey();

$return = [
    'success' => false,
];

// Ajax class.
$ajax = new \mod_gcanvas\ajax($data);
if (is_callable([$ajax, 'callable_' . $action])) {
    $return = $ajax->{'callable_' . $action}();
}

echo json_encode($return);
