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
 * All the steps to restore mod_gcanvas are defined here.
 *
 * @package     mod_gcanvas
 * @category    restore
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

// For more information about the backup and restore process, please visit:
// https://docs.moodle.org/dev/Backup_2.0_for_developers
// https://docs.moodle.org/dev/Restore_2.0_for_developers

/**
 * Defines the structure step to restore one mod_gcanvas activity.
 */
class restore_gcanvas_activity_structure_step extends restore_activity_structure_step {

    /**
     * Defines the structure to be restored.
     *
     * @return restore_path_element[].
     */
    protected function define_structure() {
        $paths = [];
        $paths[] = new restore_path_element('gcanvas', '/activity/gcanvas');

        // Return the paths wrapped into standard activity structure
        return $this->prepare_activity_structure($paths);
    }

    protected function process_gcanvas($data) {
        global $DB;

        $data = (object)$data;
        $oldid = $data->id;
        $data->course = $this->get_courseid();

        // Any changes to the list of dates that needs to be rolled should be same during course restore and course reset.
        // See MDL-9367.

        $newitemid = $DB->insert_record('gcanvas', $data);

        // immediately after inserting "activity" record, call this
        $this->apply_activity_instance($newitemid);
    }

    protected function after_execute() {
        // Add page related files, no need to match by itemname (just internally handled context)
        $this->add_related_files('mod_gcanvas', 'intro' , 'gcanvas');
        $this->add_related_files('mod_gcanvas', 'helptext' , 'gcanvas');
        $this->add_related_files('mod_gcanvas', 'background', 'gcanvas');
        $this->add_related_files('mod_gcanvas', 'toolbar_shape', 'gcanvas');
        $this->add_related_files('mod_gcanvas', 'attempt', 'gcanvas_attempt');
    }
}
