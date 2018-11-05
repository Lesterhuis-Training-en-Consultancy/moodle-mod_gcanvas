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
 * Backup steps for mod_gcanvas are defined here.
 *
 * @package     mod_gcanvas
 * @category    backup
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

// For more information about the backup and restore process, please visit:
// https://docs.moodle.org/dev/Backup_2.0_for_developers
// https://docs.moodle.org/dev/Restore_2.0_for_developers

/**
 * Define the complete structure for backup, with file and id annotations.
 */
class backup_gcanvas_activity_structure_step extends backup_activity_structure_step {

    /**
     * Defines the structure of the resulting xml file.
     *
     * @return backup_nested_element The structure wrapped by the common 'activity' element.
     * @throws base_element_struct_exception
     */
    protected function define_structure() {

//        $userinfo = $this->get_setting_value('userinfo');

        // Define each element separated
        $gcanvas = new backup_nested_element('gcanvas', ['id'], [
            'name',
            'intro',
            'introformat',
            'content',
            'contentformat',
            'helptext',
            'has_horizontal_ruler',
            'timemodified',
        ]);

        // Build the tree
        // (love this)

        // Define sources
        $gcanvas->set_source_table('gcanvas', ['id' => backup::VAR_ACTIVITYID]);

        // Define id annotations
        // (none)

        // Define file annotations
        $gcanvas->annotate_files('mod_gcanvas', 'intro', null); // This file areas haven't itemid
        $gcanvas->annotate_files('mod_gcanvas', 'helptext', null); // This file areas haven't itemid

        // Return the root element (page), wrapped into standard activity structure
        return $this->prepare_activity_structure($gcanvas);
    }
}
