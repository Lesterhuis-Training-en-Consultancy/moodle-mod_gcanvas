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
 * Testing tool classes/privacy/provider.php
 * should be placed in the root of a plugin.
 *
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @copyright 2018Mfreak.nl
 * @author    Luuk Verhoeven
 **/

use core_privacy\local\request\approved_userlist;

/**
 * Only for testing purposes
 * This is use for testing the privacy API
 * fast way to test the privacy API
 */

define('CLI_SCRIPT', true);

require('../../config.php');

$plugin = new stdClass();
include 'version.php';

$action = $argv[1] ?? false;
$userid = $argv[2] ?? false;
if (empty($action)) {
    die(PHP_EOL . 'Usage privacy-test.php [export|test|delete] userid (int)' . PHP_EOL);
}

if (empty($userid) || !is_number($userid)) {
    die(PHP_EOL . ' argv 2 must be a Userid [not provided]' . PHP_EOL);
}

function check_implements($component, $interface) {
    $manager = new \core_privacy\manager();
    $rc = new \ReflectionClass(\core_privacy\manager::class);
    $rcm = $rc->getMethod('component_implements');
    $rcm->setAccessible(true);

    return $rcm->invoke($manager, $component, $interface);
}

$provider = '\\' . $plugin->component . '\\privacy\\provider';

$user = \core_user::get_user($userid);
\core\session\manager::init_empty_session();
\core\session\manager::set_user($user);

// Get approvedlist $approvedlist
$manager = new \core_privacy\manager();
$approvedlist = new \core_privacy\local\request\contextlist_collection($user->id);
$contextlists = $manager->get_contexts_for_userid($user->id);
foreach ($contextlists as $contextlist) {
    $approvedlist->add_contextlist(new \core_privacy\local\request\approved_contextlist(
        $user,
        $contextlist->get_component(),
        $contextlist->get_contextids()
    ));
}

if ($action == 'test') {
    echo "TEST " . PHP_EOL;

    $rc = new \ReflectionClass(\core_privacy\manager::class);
    $rcm = $rc->getMethod('get_component_list');
    $rcm->setAccessible(true);

    $manager = new \core_privacy\manager();
    $components = $rcm->invoke($manager);

    $list = (object)[
        'good' => [],
        'bad' => [],
    ];

    foreach ($components as $component) {
        if ($component !== $plugin->component) {
            continue;
        }
        $compliant = $manager->component_is_compliant($component);
        if ($compliant) {
            $list->good[] = $component;
        } else {
            $list->bad[] = $component;
        }
    }

    echo "The following plugins are not compliant:\n";
    echo "=> " . implode("\n=> ", array_values($list->bad)) . "\n";

    echo "\n";
    echo "Testing the compliant plugins:\n";
    foreach ($list->good as $component) {
        $classname = \core_privacy\manager::get_provider_classname_for_component($component);
        echo "== {$component} ($classname) ==\n";
        if (check_implements($component, \core_privacy\local\metadata\null_provider::class)) {
            echo "    Claims not to store any data with reason:\n";
            echo "      '" . get_string($classname::get_reason(), $component) . "'\n";
        } else if (check_implements($component, \core_privacy\local\metadata\provider::class)) {
            $collection = new \core_privacy\local\metadata\collection($component);
            $classname::get_metadata($collection);
            $count = count($collection);
            echo "    Found {$count} items of metadata\n";
            if (empty($count)) {
                echo "!!! No metadata found!!! This an error.\n";
            }

            if (check_implements($component, \core_privacy\local\request\user_preference_provider::class)) {
                $userprefdescribed = false;
                foreach ($collection->get_collection() as $item) {
                    if ($item instanceof \core_privacy\local\metadata\types\user_preference) {
                        $userprefdescribed = true;
                        echo "     " . $item->get_name() . " : " . get_string($item->get_summary(), $component) . "\n";
                    }
                }
                if (!$userprefdescribed) {
                    echo "!!! User preference found, but was not described in metadata\n";
                }
            }

            if (check_implements($component, \core_privacy\local\request\core_user_data_provider::class)) {
                // No need to check the return type - it's enforced by the interface.
                $contextlist = $classname::get_contexts_for_userid($user->id);
                $approvedcontextlist = new \core_privacy\local\request\approved_contextlist($user, $contextlist->get_component(), $contextlist->get_contextids());
                if (count($approvedcontextlist)) {
                    $classname::export_user_data($approvedcontextlist);
                    echo "    Successfully ran a test export\n";
                } else {
                    echo "    Nothing to export.\n";
                }
            }
            if (check_implements($component, \core_privacy\local\request\shared_data_provider::class)) {
                echo "    This is a shared data provider\n";
            }
        }
    }

    echo "\n\n== Done ==\n";
} else if ($action == 'export') {
    echo "EXPORT " . PHP_EOL;

    $exportedcontent = $manager->export_user_data($approvedlist);

    echo "\n";
    echo "== File was successfully exported to {$exportedcontent}\n";

    $basedir = make_temp_directory('privacy');
    $exportpath = make_unique_writable_directory($basedir, true);
    $fp = get_file_packer();
    $fp->extract_to_pathname($exportedcontent, $exportpath);

    echo "== File export was uncompressed to {$exportpath}\n";
    echo "============================================================================\n";
} else if ($action == 'delete') {
    echo "DELETE " . PHP_EOL;

    $contextlist = $provider::get_contexts_for_userid($user->id);
    $contexts = $contextlist->get_contexts();

    $context = reset($contexts);

    $transaction = $DB->start_delegated_transaction();
    $DB->get_record('user' , ['id' => $userid]);
    $DB->set_debug(true);

    if (empty($context)) {
        die('Error - context empty');
    }

    echo "DELETE data for all users" . PHP_EOL;
    $provider::delete_data_for_all_users_in_context($context);

    echo "DELETE data for single users" . PHP_EOL;

    /** @var \core_privacy\local\request\approved_contextlist $approved */
    foreach ($approvedlist as $approved) {

        if ($approved->get_component() == $plugin->component) {
            // Test delete all users content by context.
           // $provider::delete_data_for_user($approved);

            $modulecontext = context_module::instance(319);

            $approvedlist4 = new approved_userlist($modulecontext, $plugin->component, [(int)$userid]);
            $provider::delete_data_for_users($approvedlist4);

            $userlist = new \core_privacy\local\request\userlist($modulecontext, 'gcanvas');
            $provider::get_users_in_context($userlist);
        }
    }
}