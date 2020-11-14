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
 * Library of interface functions and constants.
 *
 * @package     mod_gcanvas
 * @copyright   2018 Luuk Verhoeven - LdesignMedia.nl / MFreak.nl <luuk@ldesignmedia.nl>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Return if the plugin supports $feature.
 *
 * @param string $feature Constant representing the feature.
 *
 * @return true | null True if the feature is supported, null otherwise.
 */
function gcanvas_supports($feature) {
    switch ($feature) {
        case FEATURE_MOD_INTRO:
        case FEATURE_SHOW_DESCRIPTION:
        case FEATURE_BACKUP_MOODLE2:
            return true;
        default:
            return null;
    }
}

/**
 * Saves a new instance of the mod_gcanvas into the database.
 *
 * Given an object containing all the necessary data, (defined by the form
 * in mod_form.php) this function will create a new instance and return the id
 * number of the instance.
 *
 * @param object           $moduleinstance An object from the form.
 * @param gcanvas_mod_form $mform          The form.
 *
 * @return int The id of the newly inserted record.
 * @throws dml_exception
 */
function gcanvas_add_instance($moduleinstance, $mform = null) {
    global $DB;

    $moduleinstance->timecreated = time();

    $id = $DB->insert_record('gcanvas', $moduleinstance);

    return $id;
}

/**
 * Updates an instance of the mod_gcanvas in the database.
 *
 * Given an object containing all the necessary data (defined in mod_form.php),
 * this function will update an existing instance with new data.
 *
 * @param object           $moduleinstance An object from the form in mod_form.php.
 * @param gcanvas_mod_form $mform          The form.
 *
 * @return bool True if successful, false otherwise.
 * @throws dml_exception
 */
function gcanvas_update_instance($moduleinstance, $mform = null) {
    global $DB;

    $moduleinstance->has_horizontal_ruler = !empty($moduleinstance->has_horizontal_ruler);
    $moduleinstance->timemodified = time();
    $moduleinstance->id = $moduleinstance->instance;

    return $DB->update_record('gcanvas', $moduleinstance);
}

/**
 * Removes an instance of the mod_gcanvas from the database.
 *
 * @param int $id Id of the module instance.
 *
 * @return bool True if successful, false on failure.
 * @throws dml_exception
 */
function gcanvas_delete_instance($id) {
    global $DB;

    $exists = $DB->get_record('gcanvas', ['id' => $id]);
    if (!$exists) {
        return false;
    }

    $DB->delete_records('gcanvas', ['id' => $id]);

    return true;
}

/**
 * Returns the lists of all browsable file areas within the given module context.
 *
 * The file area 'intro' for the activity introduction field is added automatically
 *
 * @param stdClass $course  .
 * @param stdClass $cm      .
 * @param stdClass $context .
 *
 * @return string[].
 * @package     mod_gcanvas
 * @category    files
 *
 */
function gcanvas_get_file_areas($course, $cm, $context) {
    return [];
}

/**
 * File browsing support for mod_gcanvas file areas.
 *
 * @param file_browser $browser  .
 * @param array        $areas    .
 * @param stdClass     $course   .
 * @param stdClass     $cm       .
 * @param stdClass     $context  .
 * @param string       $filearea .
 * @param int          $itemid   .
 * @param string       $filepath .
 * @param string       $filename .
 *
 * @return file_info Instance or null if not found.
 * @package     mod_gcanvas
 * @category    files
 *
 */
function gcanvas_get_file_info($browser, $areas, $course, $cm, $context, $filearea, $itemid, $filepath, $filename) {
    return null;
}

/**
 * Serves the files from the mod_gcanvas file areas.
 *
 * @param stdClass $course        The course object.
 * @param stdClass $cm            The course module object.
 * @param stdClass $context       The mod_gcanvas's context.
 * @param string   $filearea      The name of the file area.
 * @param array    $args          Extra arguments (itemid, path).
 * @param bool     $forcedownload Whether or not force download.
 * @param array    $options       Additional options affecting the file serving.
 *
 * @return bool
 * @throws coding_exception
 * @throws moodle_exception
 * @throws require_login_exception
 * @package     mod_gcanvas
 * @category    files
 *
 */
function gcanvas_pluginfile($course, $cm, $context, $filearea, $args, $forcedownload, array $options = []) {

    if ($context->contextlevel != CONTEXT_MODULE) {
        return false;
    }

    require_course_login($course, true, $cm);
    if (!has_capability('mod/gcanvas:view', $context)) {
        return false;
    }

    $itemid = (int)array_shift($args);

    $fs = get_file_storage();
    $relativepath = implode('/', $args);
    $fullpath = "/$context->id/mod_gcanvas/$filearea/$itemid/$relativepath";
    if (!$file = $fs->get_file_by_hash(sha1($fullpath)) or $file->is_directory()) {
        return false;
    }

    // Finally send the file.
    // For folder module, we force download file all the time.
    send_stored_file($file, 0, 0, true, $options);
}

/**
 * Extends the global navigation tree by adding mod_gcanvas nodes if there is a relevant content.
 *
 * This can be called by an AJAX request so do not rely on $PAGE as it might not be set up properly.
 *
 * @param navigation_node $gcanvasnode An object representing the navigation tree node.
 * @param stdClass        $course      .
 * @param stdClass        $module      .
 * @param cm_info         $cm          .
 */
function gcanvas_extend_navigation($gcanvasnode, $course, $module, $cm) {
}

/**
 * Extends the settings navigation with the mod_gcanvas settings.
 *
 * This function is called when the context for the page is a mod_gcanvas module.
 * This is not called by AJAX so it is safe to rely on the $PAGE.
 *
 * @param settings_navigation $settingsnav
 * @param navigation_node     $gcanvasnode
 */
function gcanvas_extend_settings_navigation($settingsnav, $gcanvasnode = null) {
}
