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
 * Uploader output class
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   mod_gcanvas
 * @copyright 29-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

namespace mod_gcanvas\output;
defined('MOODLE_INTERNAL') || die;

use renderable;
use renderer_base;
use stdClass;
use templatable;

/**
 * Class output_uploader
 *
 * @package     mod_gcanvas
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class output_uploader implements renderable, templatable {

    /**
     * @var string
     */
    protected $filearea;

    /**
     * @var stdClass
     */
    protected $canvas;

    /**
     * output_uploader constructor.
     *
     * @param string   $filearea
     * @param stdClass $canvas
     */
    public function __construct(string $filearea, \stdClass $canvas) {
        $this->filearea = $filearea;
        $this->canvas = $canvas;
    }

    /**
     * Function to export the renderer data in a format that is suitable for a
     * mustache template. This means:
     * 1. No complex types - only stdClass, array, int, string, float, bool
     * 2. Any additional info that is required for the template is pre-calculated (e.g. capability checks).
     *
     * @param renderer_base $output Used to do a final render of any components that need to be rendered for export.
     *
     * @return stdClass|array
     */
    public function export_for_template(renderer_base $output) : stdClass {
        $object = new stdClass();
        $object->form = $this->get_uploader_form();
        $object->filearea = $this->filearea;

        return $object;
    }

    /**
     * Get uploader form
     *
     * @return string
     */
    protected function get_uploader_form() : string {
        global $PAGE;
        $form = new \mod_gcanvas\form\filepicker($PAGE->url, [
            'context' => $PAGE->context,
            'filearea' => $this->filearea,
            'canvas' => $this->canvas,
        ]);

        return $form->render();
    }

}