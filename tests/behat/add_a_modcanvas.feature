@mod @mod_gcanvas
Feature: Add a gcanvas activity
  In order to collect gcanvas attempts of users in a course
  As a teacher
  I need to add a gcanvas activity to a moodle course

  Background:
    Given the following "users" exist:
      | username | firstname | lastname | email                |
      | teacher1 | Tina      | Teacher1 | teacher1@example.com |
      | student1 | Sam       | Student1 | student1@example.com |
    And the following "courses" exist:
      | fullname | shortname | category |
      | Course 1 | C1        | 0        |
    And the following "course enrolments" exist:
      | user     | course | role           |
      | teacher1 | C1     | editingteacher |
      | student1 | C1     | student        |
    And I log in as "teacher1"
    And I am on "Course 1" course homepage with editing mode on
    And I add a "Canvas game" to section "1" and I fill the form with:
      | Canvas name | Test gcanvas     |
      | Description | Some description |
    Then I log out

  @javascript
  Scenario: Viewing a gcanvas activity as student
    Given I log in as "student1"
    And I am on "Course 1" course homepage
    And I follow "Test gcanvas"
    And I should see "Save canvas"

  Scenario: Viewing a gcanvas activity as teacher
    Given I log in as "teacher1"
    And I am on "Course 1" course homepage
    And I follow "Test gcanvas"
    Then I should see "Teacher tools"