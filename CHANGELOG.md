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
