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
 * We don't use the index.
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   moodle-mod_gcanvas
 * @copyright 2018-12-24 MFreak.nl
 * @author    Luuk Verhoeven
 **/

require_once("../../config.php");
defined('MOODLE_INTERNAL') || die;

$id = required_param('id',PARAM_INT);   // course
$PAGE->set_url('/mod/gcanvas/index.php', array('id'=>$id));

redirect("$CFG->wwwroot/course/view.php?id=$id");
