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
 * Teacher intro text
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   mod_gcanvas
 * @copyright 31-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

namespace mod_gcanvas\form;

defined('MOODLE_INTERNAL') || die;
require_once($CFG->libdir . '/formslib.php');

/**
 * Class intro
 *
 * @package     mod_gcanvas
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class intro extends \moodleform {

    /**
     * Form definition.
     *
     * @throws \coding_exception
     */
    protected function definition() : void {
        global $CFG, $PAGE;
        $mform = &$this->_form;
        $mform->addElement('editor', 'helptext', get_string('form:helptext', 'mod_gcanvas'), null, [
            'context' => $PAGE->context,
            'trusttext' => true,
            'subdirs' => false,
            'maxfiles' => EDITOR_UNLIMITED_FILES,
            'maxbytes' => $CFG->maxbytes,
            'component' => 'mod_gcanvas',
            'filearea' => 'helptext',
            'enable_filemanagement' => true,
        ]);
        $mform->setType('helptext', PARAM_RAW);
        $this->add_action_buttons(true, get_string('btn:submit', 'mod_gcanvas'));
    }
}