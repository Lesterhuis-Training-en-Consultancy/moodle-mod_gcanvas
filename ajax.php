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
 * @package   moodle-mod_gcanvas
 * @copyright 9-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/
define('AJAX_SCRIPT', true);
define('NO_DEBUG_DISPLAY', true);

require_once(__DIR__ . '/../../config.php');
defined('MOODLE_INTERNAL') || die;

$action = optional_param('action', '', PARAM_TEXT);
$data = optional_param('data', '', PARAM_RAW);

$PAGE->set_context(context_system::instance());

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