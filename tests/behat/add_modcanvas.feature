@mod @mod_gcanvas
Feature: Add a gcanvas activity
  In order to collect gcanvas attempts of users in a course
  As a teacher
  I need to add a gcanvas activity to a moodle course

@javascript
  Scenario: Add a gcanvas
    Given the following "users" exist:
      | username | firstname | lastname | email |
      | teacher1 | Teacher | 1 | teacher1@example.com |
      | student1 | Student | 1 | student1@example.com |
    And the following "courses" exist:
      | fullname | shortname | category |
      | Course 1 | C1 | 0 |
    And the following "course enrolments" exist:
      | user | course | role |
      | teacher1 | C1 | editingteacher |
      | student1 | C1 | student |
    And the following "activities" exist:
      | activity | name | description | course | idnumber |
      | gcanvas | Test gcanvas | Test gcanvas description | C1 | gcanvas0 |
    And I log in as "student1"
    And I am on "Course 1" course homepage
    And I follow "Test gcanvas"
    Then I should see "Selected items will be removed from canvas"
