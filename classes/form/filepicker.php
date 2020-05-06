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
 * Filepicker
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   mod_gcanvas
 * @copyright 9-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

namespace mod_gcanvas\form;

use mod_gcanvas\helper;

defined('MOODLE_INTERNAL') || die;
require_once($CFG->libdir . '/formslib.php');

/**
 * Class filepicker
 *
 * @package     mod_gcanvas
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class filepicker extends \moodleform {

    /**
     * Form definition.
     *
     * @throws \coding_exception
     */
    protected function definition() : void {
        $mform = &$this->_form;
        $context = $this->_customdata['context'];
        $mform->addElement('filemanager', $this->_customdata['filearea'],
            get_string('form:attachment', 'mod_gcanvas'), null,
            helper::get_file_options($context));

        $mform->addElement('hidden', 'filearea', $this->_customdata['filearea']);
        $mform->setType('filearea', PARAM_TEXT);

        $this->add_action_buttons(true, get_string('btn:save_file', 'mod_gcanvas'));
    }

    /**
     * definition_after_data
     */
    public function definition_after_data() {
        global $PAGE;

        if (in_array($this->_customdata['filearea'], ['student_image'])) {
            // Skip not needed to return in filepicker.
            return;
        }

        $draftitemid = file_get_submitted_draft_itemid($this->_customdata['filearea']);
        file_prepare_draft_area(
            $draftitemid,
            $PAGE->context->id,
            'mod_gcanvas',
            $this->_customdata['filearea'],
            $this->_customdata['canvas']->id,
            helper::get_file_options($PAGE->context)
        );

        // Set data.
        $this->set_data([
            $this->_customdata['filearea'] => $draftitemid,
        ]);
    }
}