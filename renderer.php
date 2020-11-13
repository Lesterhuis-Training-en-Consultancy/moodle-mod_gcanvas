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
 * Rendering methods
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   mod_gcanvas
 * @copyright 8-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

use mod_gcanvas\output\output_canvas_attempts;

defined('MOODLE_INTERNAL') || die;

/**
 * Class mod_gcanvas_renderer
 *
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mod_gcanvas_renderer extends plugin_renderer_base {

    /**
     * Javascript helper
     *
     * @param stdClass $canvas
     *
     * @throws coding_exception
     */
    public function add_javascript_helper(\stdClass $canvas) : void {

        $this->page->requires->strings_for_js([
            'javascript:confirm_title',
            'javascript:confirm_desc',
            'javascript:yes',
            'javascript:no',
            'javascript:updated',
        ], 'mod_gcanvas');

        $backgrounds = \mod_gcanvas\helper::get_images('background', $this->page->context, $this->page->cm->instance, 1);

        $this->page->requires->js('/mod/gcanvas/javascript/fabric.js', true);
        $this->page->requires->js_call_amd('mod_gcanvas/canvas', 'initialise', [
            [
                'background' => reset($backgrounds),
                'debugjs' => \mod_gcanvas\helper::has_debugging_enabled(),
                'id' => $this->page->url->get_param('id'),
                'hasHorizontalRuler' => $canvas->has_horizontal_ruler ? true : false,
                // TODO get this from module settings.
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
        return $this->render_from_template($template, $data);
    }

    /**
     * Render the main canvas
     *
     * @param stdClass $canvas
     *
     * @return bool|string
     * @throws coding_exception
     * @throws moodle_exception
     */
    public function render_canvas(\stdClass $canvas) {
        $context = (new \mod_gcanvas\output\output_canvas($canvas))->export_for_template($this);

        return $this->render_from_template('mod_gcanvas/canvas', $context);
    }

    /**
     * Render attempts
     *
     * @param int $id
     *
     * @return string
     * @throws coding_exception
     * @throws moodle_exception
     */
    public function render_attempts(int $id) : string {
        $context = (new output_canvas_attempts($id))->export_for_template($this);

        return $this->render_from_template('mod_gcanvas/canvas_attempts', $context);
    }

    /**
     * Uploader form
     *
     * @param string   $filearea
     *
     * @param stdClass $moduleinstance
     *
     * @return string
     * @throws moodle_exception
     */
    public function render_uploader(string $filearea, \stdClass $moduleinstance) : string {
        $context = (new \mod_gcanvas\output\output_uploader($filearea, $moduleinstance))->export_for_template($this);

        return $this->render_from_template('mod_gcanvas/canvas_uploader', $context);
    }

}