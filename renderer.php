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
 *rendering methods
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   moodle-mod_gcanvas
 * @copyright 8-10-2018 MoodleFreak.com
 * @author    Luuk Verhoeven
 **/

defined('MOODLE_INTERNAL') || die;

class mod_gcanvas_renderer extends plugin_renderer_base {

    /**
     * Javascript helper
     */
    public function add_javascript_helper() {
        global $PAGE;
        $PAGE->requires->js_call_amd('mod_gcanvas/canvas', 'initialise', [
            [
                'debugjs' => \mod_gcanvas\helper::has_debugging_enabled(),
                'id' => $PAGE->url->get_param('id'),
            ],
        ]);
    }

    /**
     * Render templates used in display class
     *
     * @param string   $template
     * @param stdClass $data
     *
     * @return bool|string
     * @throws moodle_exception
     */
    public function render_template(string $template, \stdClass $data) {
        return parent::render_from_template($template, $data);
    }
}