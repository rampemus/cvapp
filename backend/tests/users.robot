*** Settings ***

Documentation   Creating, editing and deleting
Library         SeleniumLibrary  timeout=5  implicit_wait=0
Library         ReactLibrary
Library         OperatingSystem
Library         WebpackLibrary

Resource        ${CURDIR}/resources/env.robot
Resource        ${CURDIR}/resources/common.robot

Suite Setup     Start React and open browser
Suite Teardown  Stop React and close browser


*** Test Cases ***

Create test user
  Create test user with root user
  Page should contain  User ${TEST_USERFULLNAME} was created

Login with created test user
  Logout and login with test user
  Page should contain  Logged in as ${TEST_USERFULLNAME}

User can change name
  Navigate to user editor  ${TEST_USERNAME}
  Input Text  NewUserFullName  Edited
  Click Element  SubmitUserForm
  Wait for react  reducer=loader
  Page should contain  ${TEST_USERFULLNAME}Edited

User can change password
  Navigate to user editor  ${TEST_USERNAME}
  Input Text  OldPassword  ${TEST_PASSWORD}
  Input Text  NewPassword  ${TEST_PASSWORD}Edited
  Input Text  NewPasswordConfirm  ${TEST_PASSWORD}Edited
  Click Element  SubmitUserForm
  Wait for react  reducer=loader
  Page should contain  ${TEST_USERFULLNAME}Edited
  Click Element  Logout
  Login  ${TEST_USERNAME}  ${TEST_PASSWORD}Edited
  Wait for react  reducer=loader
  Page should contain  Logged in as ${TEST_USERFULLNAME}Edited

User can change username
  Navigate to user editor  ${TEST_USERNAME}
  Input Text  NewUserName  Edited
  Click Element  SubmitUserForm
  Wait for react  reducer=loader
  Click Element  Logout
  Login  ${TEST_USERNAME}Edited  ${TEST_PASSWORD}Edited
  Wait for react  reducer=loader
  Sleep  100ms
  Page should contain  Logged in as ${TEST_USERFULLNAME}Edited

Remove test user
  Go to  ${SERVER}
  Wait for react  reducer=loader
  Delete user  ${TEST_USERNAME}Edited
  Page should contain  User ${TEST_USERFULLNAME}Edited was deleted

