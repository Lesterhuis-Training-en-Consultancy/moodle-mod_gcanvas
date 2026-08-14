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
 * Unit tests for mod_gcanvas lib functions.
 *
 * @package     mod_gcanvas
 * @copyright   2026 Lesterhuis Training & Consultancy
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace mod_gcanvas;

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/mod/gcanvas/lib.php');

/**
 * Unit tests for mod_gcanvas lib functions.
 *
 * Focus: access control in gcanvas_pluginfile(). Only the deny paths are asserted, because the
 * allow path ends in send_stored_file() which is not suitable for a unit test.
 *
 * @package     mod_gcanvas
 * @copyright   2026 Lesterhuis Training & Consultancy
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      ::gcanvas_pluginfile
 */
final class lib_test extends \advanced_testcase {
    /**
     * A co-enrolled user must not be able to fetch another user's attempt file.
     */
    public function test_pluginfile_denies_other_users_attempt(): void {
        global $DB;
        $this->resetAfterTest();

        $course = $this->getDataGenerator()->create_course();
        $gcanvas = $this->getDataGenerator()->create_module('gcanvas', ['course' => $course->id]);
        $cm = get_coursemodule_from_instance('gcanvas', $gcanvas->id);
        $context = \context_module::instance($cm->id);

        $owner = $this->getDataGenerator()->create_and_enrol($course, 'student');
        $other = $this->getDataGenerator()->create_and_enrol($course, 'student');

        $attemptid = $DB->insert_record('gcanvas_attempt', (object) [
            'gcanvas_id' => $gcanvas->id,
            'user_id' => $owner->id,
            'json_data' => '{}',
            'status' => 'final',
            'added_on' => time(),
        ]);

        // Another enrolled student must be denied (function returns false before serving).
        $this->setUser($other);
        $result = \gcanvas_pluginfile($course, $cm, $context, 'attempt', [$attemptid, 'x.png'], true, []);
        $this->assertFalse($result);
    }

    /**
     * A co-enrolled user must not be able to fetch another user's uploaded student image.
     */
    public function test_pluginfile_denies_other_users_student_image(): void {
        $this->resetAfterTest();

        $course = $this->getDataGenerator()->create_course();
        $gcanvas = $this->getDataGenerator()->create_module('gcanvas', ['course' => $course->id]);
        $cm = get_coursemodule_from_instance('gcanvas', $gcanvas->id);
        $context = \context_module::instance($cm->id);

        $owner = $this->getDataGenerator()->create_and_enrol($course, 'student');
        $other = $this->getDataGenerator()->create_and_enrol($course, 'student');

        // The student_image files are stored under itemid = owner user id; another user must be denied.
        $this->setUser($other);
        $result = \gcanvas_pluginfile($course, $cm, $context, 'student_image', [$owner->id, 'x.png'], true, []);
        $this->assertFalse($result);
    }
}
