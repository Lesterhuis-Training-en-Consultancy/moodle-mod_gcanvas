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
 * Backup/restore roundtrip tests for mod_gcanvas.
 *
 * @package     mod_gcanvas
 * @copyright   2026 Lesterhuis Training & Consultancy
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace mod_gcanvas;

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/course/lib.php');

/**
 * Backup/restore roundtrip tests for mod_gcanvas.
 *
 * Guards the file annotations: intro and helptext files live under a fixed itemid (0) and must
 * survive a backup/restore cycle (LS-4206), while toolbar_shape and background are keyed by the
 * activity record id.
 *
 * @package     mod_gcanvas
 * @copyright   2026 Lesterhuis Training & Consultancy
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers      \backup_gcanvas_activity_structure_step
 * @covers      \restore_gcanvas_activity_structure_step
 */
final class backup_restore_test extends \advanced_testcase {

    /**
     * Files embedded in the intro and help text must survive duplication (backup + restore).
     */
    public function test_duplicate_module_keeps_intro_and_helptext_files(): void {
        $this->resetAfterTest();
        $this->setAdminUser();

        $course = $this->getDataGenerator()->create_course();
        $gcanvas = $this->getDataGenerator()->create_module('gcanvas', ['course' => $course->id]);
        $cm = get_fast_modinfo($course)->get_cm(
            get_coursemodule_from_instance('gcanvas', $gcanvas->id)->id
        );
        $context = \context_module::instance($cm->id);

        // Store one file in each fixed-itemid area, plus the instance-keyed teacher areas.
        $fs = get_file_storage();
        $areas = [
            'intro' => 0,
            'helptext' => 0,
            'toolbar_shape' => $gcanvas->id,
            'background' => $gcanvas->id,
        ];
        foreach ($areas as $area => $itemid) {
            $fs->create_file_from_string((object) [
                'contextid' => $context->id,
                'component' => 'mod_gcanvas',
                'filearea' => $area,
                'itemid' => $itemid,
                'filepath' => '/',
                'filename' => $area . '.png',
            ], 'dummy image content for ' . $area);
        }

        $newcm = duplicate_module($course, $cm);
        $newcontext = \context_module::instance($newcm->id);

        foreach ($areas as $area => $unused) {
            $files = $fs->get_area_files($newcontext->id, 'mod_gcanvas', $area, false, 'id', false);
            $this->assertCount(1, $files, "File area '{$area}' lost its file during backup/restore.");
            $this->assertSame($area . '.png', reset($files)->get_filename());
        }
    }
}
