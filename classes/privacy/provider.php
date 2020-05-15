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
 * Privacy provider.
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   mod_gcanvas
 * @copyright 9-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/

namespace mod_gcanvas\privacy;
defined('MOODLE_INTERNAL') || die;

use core_privacy\local\metadata\collection;
use core_privacy\local\request\approved_contextlist;
use core_privacy\local\request\approved_userlist;
use core_privacy\local\request\contextlist;
use core_privacy\local\request\transform;
use core_privacy\local\request\userlist;
use core_privacy\local\request\writer;

/**
 * Privacy provider.
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @package   mod_gcanvas
 * @copyright 31-10-2018 MFreak.nl
 * @author    Luuk Verhoeven
 **/
class provider implements \core_privacy\local\metadata\provider,
    \core_privacy\local\request\core_userlist_provider,
    \core_privacy\local\request\plugin\provider {

    /**
     * Returns meta data about this system.
     *
     * @param collection $collection The initialised collection to add items to.
     *
     * @return  collection     A listing of user data stored through this system.
     */
    public static function get_metadata(collection $collection) : collection {

        $collection->add_database_table('gcanvas_attempt', [
            'gcanvas' => 'privacy:metadata:attempt:gcanvas',
            'json_data' => 'privacy:metadata:attempt:json_data',
            'added_on' => 'privacy:metadata:attempt:added_on',
        ], 'privacy:metadata:attempt');

        return $collection;
    }

    /**
     * Get the list of contexts that contain user information for the specified user.
     *
     * @param int $userid The user to search.
     *
     * @return  \core_privacy\local\request\contextlist   $contextlist  The contextlist containing the list of contexts
     *                                                    used in this plugin.
     */
    public static function get_contexts_for_userid(int $userid) : contextlist {
        $contextlist = new contextlist();

        $sql = "SELECT DISTINCT
                       ctx.id
                  FROM {context} ctx
                  JOIN {course_modules} cm ON cm.id = ctx.instanceid AND ctx.contextlevel = :contextmodule
                  JOIN {modules} m ON cm.module = m.id AND m.name = :modulename
                  JOIN {gcanvas} gcanvas ON cm.instance = gcanvas.id
                  JOIN {gcanvas_attempt} attempt ON gcanvas.id = attempt.gcanvas_id
                 WHERE attempt.user_id = :user_id";

        $params = [
            'contextmodule' => CONTEXT_MODULE,
            'modulename' => 'gcanvas',
            'user_id' => $userid,
        ];

        $contextlist->add_from_sql($sql, $params);

        return $contextlist;
    }

    /**
     * Export all user data for the specified user, in the specified contexts.
     *
     * @param approved_contextlist $contextlist                               The approved contexts to export
     *                                                                        information for.
     *
     * @throws \dml_exception
     */
    public static function export_user_data(approved_contextlist $contextlist) {
        if (empty($contextlist->count())) {
            return;
        }

        $user = $contextlist->get_user();

        foreach ($contextlist->get_contexts() as $context) {
            if ($context->contextlevel != CONTEXT_MODULE) {
                continue;
            }

            $gcanvasdata = self::get_gcanvas_by_context($context);

            // Get gcanvas details object for output.
            $gcanvas = self::get_gcanvas_output($gcanvasdata);
            writer::with_context($context)->export_data([], $gcanvas);

            // Get the gcanvas attempts.
            $attemptsdata = self::get_gcanvas_attempts_by_gcanvas($gcanvasdata->id, $user->id);

            foreach ($attemptsdata as $attemptdata) {

                // Get gcanvas attempt details object for output.
                $attempt = self::get_gcanvas_attempt_output($attemptdata);
                $itemid = $attemptdata->id;

                writer::with_context($context)->export_data(['attempts'], $attempt)->export_area_files(['attempts'],
                    'mod_gcanvas', 'attempt', $itemid);
            }
        }
    }

    /**
     * Helper function to retrieve gcanvas attempts
     *
     * @param int $gcanvasid The gcanvas ID to retrieve gcanvas attempts by.
     * @param int $userid    The user ID to retrieve gcanvas attempts submitted.
     *
     * @return array                Array of gcanvas attempt details.
     * @throws \dml_exception
     */
    protected static function get_gcanvas_attempts_by_gcanvas($gcanvasid, $userid) {
        global $DB;

        $params = [
            'gcanvas' => $gcanvasid,
            'user_id' => $userid,
        ];

        $sql = "SELECT attempt.*
                  FROM {gcanvas_attempt} attempt
                 WHERE attempt.gcanvas_id = :gcanvas
                   AND attempt.user_id = :user_id";

        return $DB->get_records_sql($sql, $params);
    }

    /**
     * Helper function to return gcanvas attempts submitted by a user and their contextlist.
     *
     * @param approved_contextlist $contextlist                             stdClass with the contexts related to a
     *                                                                      userid to retrieve gcanvas attempts by.
     * @param int                  $userid                                  The user ID to find gcanvas attempts
     *                                                                      that were submitted by.
     *
     * @return array                Array of gcanvas attempts details.
     * @throws \coding_exception
     * @throws \dml_exception
     */
    protected static function get_gcanvas_attempts_by_contextlist(approved_contextlist $contextlist, int $userid) {
        global $DB;

        [$contextsql, $contextparams] = $DB->get_in_or_equal($contextlist->get_contextids(), SQL_PARAMS_NAMED);

        $params = [
            'contextmodule' => CONTEXT_MODULE,
            'modulename' => 'gcanvas',
            'user_id' => $userid,
        ];

        $sql = "SELECT attempt.*
                  FROM {context} ctx
                  JOIN {course_modules} cm ON cm.id = ctx.instanceid AND ctx.contextlevel = :contextmodule
                  JOIN {modules} m ON cm.module = m.id AND m.name = :modulename
                  JOIN {gcanvas} gcanvas ON cm.instance = gcanvas.id
                  JOIN {gcanvas_attempt} attempt ON attempt.gcanvas_id = gcanvas.id
                 WHERE attempt.user_id = :user_id";

        $sql .= " AND ctx.id {$contextsql}";
        $params += $contextparams;

        return $DB->get_records_sql($sql, $params);
    }

    /**
     * Helper function generate gcanvas output object for exporting.
     *
     * @param object $gcanvasdata Object containing gcanvas data.
     *
     * @return object                   Formatted gcanvas output object for exporting.
     */
    protected static function get_gcanvas_output($gcanvasdata) {
        $gcanvas = (object)[
            'name' => $gcanvasdata->name,
            'intro' => $gcanvasdata->intro,
            'timemodified' => transform::datetime($gcanvasdata->timemodified),
        ];

        if ($gcanvasdata->timemodified != 0) {
            $gcanvas->timemodified = transform::datetime($gcanvasdata->timemodified);
        }

        return $gcanvas;
    }

    /**
     * Helper function generate gcanvas attempt output object for exporting.
     *
     * @param \stdClass $attemptdata Object containing gcanvas attempt data.
     *
     * @return \stdClass                   Formatted gcanvas attempt output for exporting.
     */
    protected static function get_gcanvas_attempt_output($attemptdata) {
        $attempt = (object)[
            'gcanvas' => $attemptdata->gcanvas_id,
            'json_data' => $attemptdata->json_data,
            'added_on' => $attemptdata->added_on,
        ];

        if ($attemptdata->added_on != 0) {
            $attempt->added_on = transform::datetime($attemptdata->added_on);
        }

        return $attempt;
    }

    /**
     * Helper function to return gcanvas for a context module.
     *
     * @param stdClass $context The context module stdClass to return the gcanvas record by.
     *
     * @return mixed            The gcanvas details or null record associated with the context module.
     * @throws \dml_exception
     */
    protected static function get_gcanvas_by_context($context) {
        global $DB;

        $params = [
            'modulename' => 'gcanvas',
            'contextmodule' => CONTEXT_MODULE,
            'contextid' => $context->id,
        ];

        $sql = "SELECT gcanvas.*
                  FROM {gcanvas} gcanvas
                  JOIN {course_modules} cm ON gcanvas.id = cm.instance
                  JOIN {modules} m ON m.id = cm.module AND m.name = :modulename
                  JOIN {context} ctx ON ctx.instanceid = cm.id AND ctx.contextlevel = :contextmodule
                 WHERE ctx.id = :contextid";

        return $DB->get_record_sql($sql, $params);
    }

    /**
     * Delete all data for all users in the specified context.
     *
     * @param \context $context $context The specific context to delete data for.
     *
     * @throws \dml_exception
     */
    public static function delete_data_for_all_users_in_context(\context $context) {
        global $DB;

        if ($context->contextlevel == CONTEXT_MODULE) {
            // Delete all assignment submissions for the assignment associated with the context module.
            $gcanvas = self::get_gcanvas_by_context($context);
            if ($gcanvas != null) {
                $DB->delete_records('gcanvas_attempt', ['gcanvas_id' => $gcanvas->id]);

                // Delete all file uploads associated with the assignment submission for the specified context.
                $fs = get_file_storage();
                $fs->delete_area_files($context->id, 'mod_gcanvas', 'attempt');
            }
        }
    }

    /**
     * Delete all user data for the specified user, in the specified contexts.
     *
     * @param approved_contextlist $contextlist                               The approved contexts and user
     *                                                                        information to delete information for.
     *
     * @throws \coding_exception
     * @throws \dml_exception
     */
    public static function delete_data_for_user(approved_contextlist $contextlist) {
        global $DB;

        if (empty($contextlist->count())) {
            return;
        }

        $userid = $contextlist->get_user()->id;

        // Only retrieve gcanvas attempts submitted by the user for deletion.
        $gcanvasattemptids = array_keys(self::get_gcanvas_attempts_by_contextlist($contextlist, $userid));
        $DB->delete_records_list('gcanvas_attempt', 'id', $gcanvasattemptids);

        // Delete all file uploads associated with the gcanvas attempt for the user's specified list of contexts.
        $fs = get_file_storage();
        foreach ($contextlist->get_contextids() as $contextid) {
            foreach ($gcanvasattemptids as $itemid) {
                $fs->delete_area_files($contextid, 'mod_gcanvas', 'attempt', $itemid);
            }
        }
    }

    /**
     * Get the list of users who have data within a context.
     *
     * @param userlist $userlist The userlist containing the list of users who have data in this context/plugin
     *                           combination.
     */
    public static function get_users_in_context(userlist $userlist) : void {
        $context = $userlist->get_context();

        if (!is_a($context, \context_module::class)) {
            return;
        }

        // Find users with gcanvas_attempt entries.
        $sql = "
            SELECT link.user_id
              FROM {%s} link
              JOIN {modules} m
                ON m.name = :modulename
              JOIN {course_modules} cm
                ON cm.instance = link.gcanvas_id
               AND cm.module = m.id
              JOIN {context} ctx
                ON ctx.instanceid = cm.id
               AND ctx.contextlevel = :modlevel
             WHERE ctx.id = :contextid";

        $params = [
            'modulename' => 'gcanvas',
            'modlevel' => CONTEXT_MODULE,
            'contextid' => $context->id,
        ];

        $userlist->add_from_sql('user_id', sprintf($sql, 'gcanvas_attempt'), $params);
    }

    /**
     * Delete multiple users within a single context.
     *
     * @param approved_userlist $userlist The approved context and user information to delete information for.
     *
     * @throws \coding_exception
     * @throws \dml_exception
     */
    public static function delete_data_for_users(approved_userlist $userlist) : void {
        global $DB;

        $context = $userlist->get_context();
        $userids = $userlist->get_userids();

        // Prepare SQL to gather all linked IDs.
        [$insql, $inparams] = $DB->get_in_or_equal($userids, SQL_PARAMS_NAMED);
        $completedsql = "
            SELECT link.id
              FROM {%s} link
              JOIN {modules} m
                ON m.name = :modulename
              JOIN {course_modules} cm
                ON cm.instance = link.gcanvas_id
               AND cm.module = m.id
             WHERE cm.id = :instanceid
               AND link.user_id $insql";

        $completedparams = array_merge($inparams, [
            'instanceid' => (int)$context->instanceid,
            'modulename' => 'gcanvas',
        ]);

        // Delete all gcanvas_attempt entries.
        $attempts = $DB->get_fieldset_sql(sprintf($completedsql, 'gcanvas_attempt'), $completedparams);
        if (!empty($attempts)) {
            [$insql, $inparams] = $DB->get_in_or_equal($attempts, SQL_PARAMS_NAMED);
            $DB->delete_records_select('gcanvas_attempt', "id $insql", $inparams);
        }
    }
}