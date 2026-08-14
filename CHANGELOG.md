# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

# Plugin version.php information
```php
// Plugin release number corresponds to the lasest tested Moodle version in which the plugin has been tested.
$plugin->release = '3.5.7'; // [3.5.7]

// Plugin version number corresponds to the latest plugin version.
$plugin->version = 2019010100; // 2019-01-01
```

# How do I make a good changelog?
Guiding Principles
* Changelogs are for humans, not machines.
* There should be an entry for every single version.
* The same types of changes should be grouped.
* The latest version comes first.
* The release date of each version is displayed.

Types of changes
* **Added** for new features.
* **Changed** for changes in existing functionality.
* **Deprecated** for soon-to-be removed features.
* **Removed** for now removed features.
* **Fixed** for any bug fixes.
* **Security** in case of vulnerabilities.

## Version (4.5.2) - 2026-08-14
Vervolg security review (LS-4206), na 4.5.1.

##### Security
- Applied the attempt-style ownership check to the `student_image` file area in `gcanvas_pluginfile()` as well — a co-enrolled user could otherwise fetch another user's uploaded image. Follow-up to the per-user itemid change in 4.5.1.

##### Fixed
- `callable_save_canvas()` now rejects guests and validates the decoded payload (must be a real image within the upload size limit) and the attempt status, matching the file-picker validation path.
- Backup now annotates the `helptext` file area under its fixed itemid (was keyed by record id), so images embedded in the help text are included in backups.
- Restore now restores `intro` and `helptext` files under their fixed itemid instead of mapping them through the activity id, so images embedded in the intro and help text survive restore/duplication (the `intro` half predates the review).
- Restore now processes `gcanvas_attempt` records and their files when user data is included; previously attempts were lost on restore.
- Added the missing `timecreated` column to the `gcanvas` table (install.xml + upgrade step) so the value set in `gcanvas_add_instance()` is actually stored; resolves the schema/code drift.
- Hardened the AJAX input handling: the router rejects malformed JSON payloads with a clean `invalidrequest` error, handler methods no longer read undefined properties, `json_data` must be a decodable JSON string within the upload size limit (like `canvas_data`), and the upload `filearea` is validated against an allow-list. The unreachable unknown-filearea guard in `helper::upload_file()` now throws a `coding_exception` instead of an untranslatable `moodle_exception`.
- `view.php` and `ajax.php` now enforce `mod/gcanvas:view` explicitly, so a role override that prevents the capability is honoured consistently with `gcanvas_pluginfile()`.
- Privacy metadata now matches the `gcanvas_attempt` schema: field `gcanvas_id` (was misdeclared as `gcanvas`) and the previously missing `user_id` and `status` columns are declared, with en/nl language strings.
- Cleaned up stale scaffolding metadata in `db/install.xml` (header still said "Folder module").

##### Changed
- Added `RISK_XSS` to the `mod/gcanvas:teacher` capability metadata (it gates the rich-text help-text editor).

##### Added
- PHPUnit access-control test for `gcanvas_pluginfile()` (denies another user's `attempt` and `student_image` files) plus a test data generator; enabled PHPUnit in the CI workflow.
- PHPUnit backup/restore roundtrip test (`tests/backup_restore_test.php`): duplicating an activity must keep the files in all four teacher file areas (`intro`, `helptext`, `toolbar_shape`, `background`).

## Version (4.5.1) - 2026-06-23
Security release naar aanleiding van een MDL Shield security code review (LS-4198).

##### Security
- Fixed stored XSS in the activity help text. The `intro` action now enforces the `mod/gcanvas:teacher` capability with `require_capability()` instead of a discarded `has_capability()` check, so students can no longer overwrite the help text. Help text is no longer rendered with `noclean`, so the HTML purifier strips any injected scripts (defense in depth).

- Attempt images are now served only to their owner (or a teacher). `gcanvas_pluginfile()` previously gated the `attempt` file area on `mod/gcanvas:view` only, allowing a co-enrolled user to fetch another user's drawing (IDOR).

##### Fixed
- Fixed a fatal error on the no-id code path in `view.php` (a bareword was passed to `moodle_exception` instead of the `'mod_gcanvas'` string) and added the matching `missingidandcmid` language string (en/nl).
- Student image uploads are now scoped per user (`itemid = userid`) instead of sharing a single module-instance area, preventing cross-user file collisions/overwrites. Teacher-managed areas (`background`, `toolbar_shape`) remain keyed by the module instance.
- `gcanvas_delete_instance()` now also deletes dependent `gcanvas_attempt` rows, so they are no longer orphaned when an activity is deleted.
- Implemented the missing restore decode rules (`GCANVASINDEX`, `GCANVASVIEWBYID`) to mirror the backup encode step, so cross-activity links are restored correctly instead of leaving literal placeholder tokens.

##### Changed
- `thirdpartylibs.xml`: declared the bundled Spectrum JavaScript library and corrected the Fabric.js version to 2.4.2 (was 2.4.1).
- Code style: resolved Moodle CodeSniffer (PSR-12) violations across the plugin — whitespace/formatting only, no behaviour change.

## Version (4.5.0) - 2025-08-13
- Updating version.php after confirmation from community works on Moodle 5.0 

## Version (4.5.0) - 2024-09-10
- Upgraded and refactored for Moodle 4.5

## Version (4.4.0) - 2024-04-05
- Upgraded and refactored for Moodle 4.4

## Version (4.3.0) - 2024-04-05
- Upgraded and refactored for Moodle 4.3

## Version (4.2.1) - 2024-04-05
- Fixed issue with saving and loading canvas

## Version (4.2.0) - 2024-02-29
- Upgraded and refactored for Moodle 4.2
- Deprecated support for versions before Moodle 3.9 and PHP 7.4

## Version (4.0.1) - 2022-08-08
##### Changed
- No double activity description 

## Version (3.10.1) - 2020-12-08

##### Added
- Intro text support

## Version (3.10) - 2020-11-14

##### Changed
- Updated version number, no issues found.
- Travis testing 
- Docblocks

##### Removed
- Remove `.eslintrc` `Gruntfile.js` and `packages.json` from the project causes Travis issues.

## Version (3.9) - 2020-05-06

##### Changed
- Updated version number, no issues found.
- Minimum version PHP 7.2
- Add core_userlist_provider

## Version (3.8.0) - 2019-10-11
##### Changed
- Update version number, no issues founded in Moodle 3.8


## Version (3.5.7) - 2019-05-20
##### Added
- Release of the first official version.

##### Changed
- Adding undo function.
