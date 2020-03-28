*** Settings ***

Documentation   Login and user handling
Library         SeleniumLibrary  timeout=5  implicit_wait=0
Library         ReactLibrary
Library         DebugLibrary
Library         OperatingSystem
Library         WebpackLibrary

Suite Setup     Start React and open browser
Suite Teardown  Stop React and close browser

Resource        ${CURDIR}/env.robot
Resource        ${CURDIR}/common.robot


*** Test Cases ***

Create test user
  Login with Root User
  Wait for react  reducer=loader
  Go to  ${SERVER}/users/
  Wait for react  reducer=loader
  Click Element  AddUser
  Wait for react  reducer=loader
  Page should contain  Create new user
  Input Text  NewUserFullName  ${TEST_USERNAME}
  Input Text  NewUserName  ${TEST_USERNAME}
  Input Text  NewPassword  ${TEST_PASSWORD}
  Input Text  NewPasswordConfirm  ${TEST_PASSWORD}
  Click Element  SubmitUserForm
  Wait for react  reducer=loader
  Page should contain  User ${TEST_USERNAME} was created

Login with created test user
  Click Element  Logout
  Login with Test User
  Wait for react  reducer=loader
  Page should contain  Logged in as ${TEST_USERNAME}

# TODO: Test user editing tools

Remove test user
  Go to  ${SERVER}/users/
  Wait for react  reducer=loader
  Mouse Over  LinkTo${TEST_USERNAME}
  Click Element  Delete${TEST_USERNAME}
  Wait for react  reducer=loader
  Page should contain  User ${TEST_USERNAME} was deleted


*** Keywords ***

Start React and Open Browser
  Start Webpack  npm run start:tsnode --scripts-prepend-node-path  check=Server running on port 3004
  Set environment variable  BROWSER  none
  Open Browser  ${SERVER}  ${BROWSER}
  Set Window Size  1280  1024

Stop React and Close Browser
  Stop Webpack
  Close Browser
