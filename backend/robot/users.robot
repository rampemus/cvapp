*** Settings ***

Documentation   Login and user handling
Library         SeleniumLibrary  timeout=5  implicit_wait=0
Library         ReactLibrary
Library         DebugLibrary
Library         OperatingSystem
Library         WebpackLibrary

Resource        ${CURDIR}/env.robot
Resource        ${CURDIR}/common.robot

Suite Setup     Start React and open browser
Suite Teardown  Stop React and close browser


*** Test Cases ***

Create test user
  Login with Root User
  Wait for react  reducer=loader
  Go to  ${SERVER}/users/
  Wait for react  reducer=loader
  Click Element  AddUser
  Wait for react  reducer=loader
  Page should contain  Create new user
  Input Text  NewUserFullName  ${TEST_USERFULLNAME}
  Input Text  NewUserName  ${TEST_USERNAME}
  Input Text  NewPassword  ${TEST_PASSWORD}
  Input Text  NewPasswordConfirm  ${TEST_PASSWORD}
  Click Element  SubmitUserForm
  Wait for react  reducer=loader
  Page should contain  User ${TEST_USERFULLNAME} was created

Login with created test user
  Click Element  Logout
  Login with Test User
  Wait for react  reducer=loader
  Page should contain  Logged in as ${TEST_USERFULLNAME}

User can change name
  Go to  ${SERVER}/users/
  Wait for react  reducer=loader
  Click Element  LinkTo${TEST_USERNAME}
  Wait for react  reducer=loader
  Click Element  EditUser
  Input Text  NewUserFullName  Edited
  Click Element  SubmitUserForm
  Wait for react  reducer=loader
  Page should contain  ${TEST_USERFULLNAME}Edited

User can change password
  Go to  ${SERVER}/users/
  Wait for react  reducer=loader
  Click Element  LinkTo${TEST_USERNAME}
  Wait for react  reducer=loader
  Click Element  EditUser
  Input Text  OldPassword  ${TEST_PASSWORD}
  Input Text  NewPassword  ${TEST_PASSWORD}Edited
  Input Text  NewPasswordConfirm  ${TEST_PASSWORD}Edited
  Click Element  SubmitUserForm
  Wait for react  reducer=loader
  Page should contain  ${TEST_USERFULLNAME}Edited
  Click Element  Logout
  Go to  ${SERVER}
  Wait for react
  Input Text  username  ${TEST_USERNAME}
  Input Text  password  ${TEST_PASSWORD}Edited
  Click Element  RememberMeCheckbox
  Click Element  login
  Wait for react  reducer=loader
  Page should contain  Logged in as ${TEST_USERFULLNAME}Edited

Remove test user
  Go to  ${SERVER}
  Wait for react  reducer=loader
  Click Element  Users
  Wait for react  reducer=loader
  Mouse Over  LinkTo${TEST_USERNAME}
  Click Element  Delete${TEST_USERNAME}
  Wait for react  reducer=loader
  Page should contain  User ${TEST_USERFULLNAME}Edited was deleted

