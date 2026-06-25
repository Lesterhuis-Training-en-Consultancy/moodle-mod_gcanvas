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
 * mod_gcanvas test data generator.
 *
 * @package     mod_gcanvas
 * @copyright   2026 Lesterhuis Training & Consultancy
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * mod_gcanvas test data generator class.
 *
 * @package     mod_gcanvas
 * @copyright   2026 Lesterhuis Training & Consultancy
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mod_gcanvas_generator extends testing_module_generator {

    /**
     * Create a new gcanvas activity instance.
     *
     * @param array|stdClass|null $record
     * @param array|null $options
     * @return stdClass
     */
    public function create_instance($record = null, ?array $options = null) {
        $record = (object) (array) $record;

        if (!isset($record->name)) {
            $record->name = 'Canvas game';
        }
        if (!isset($record->has_horizontal_ruler)) {
            $record->has_horizontal_ruler = 0;
        }

        return parent::create_instance($record, (array) $options);
    }
}
