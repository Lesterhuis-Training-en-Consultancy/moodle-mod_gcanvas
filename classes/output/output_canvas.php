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
 * Output class for the canvas.
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   moodle-mod_gcanvas
 * @copyright 9-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

namespace mod_gcanvas\output;
defined('MOODLE_INTERNAL') || die;

use renderable;
use renderer_base;
use stdClass;
use templatable;

class output_canvas implements renderable, templatable {

    /**
     * Function to export the renderer data in a format that is suitable for a
     * mustache template. This means:
     * 1. No complex types - only stdClass, array, int, string, float, bool
     * 2. Any additional info that is required for the template is pre-calculated (e.g. capability checks).
     *
     * @param renderer_base $output Used to do a final render of any components that need to be rendered for export.
     *
     * @return stdClass|array
     * @throws \coding_exception
     */
    public function export_for_template(renderer_base $output) {
        global $PAGE;
        $data = [];

        $object = new stdClass();
        $object->data = array_values($data);
        $object->background_form = false;

        // Check if the user is teacher.
        $object->is_teacher = has_capability('mod/gcanvas:teacher', $PAGE->context);
        $object->linkintro = clone $PAGE->url;
        $object->linkintro->params(['action' => 'intro']);
        $object->linkintro = $object->linkintro->out(false);

        return $object;
    }

}