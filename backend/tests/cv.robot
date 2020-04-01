*** Settings ***

Documentation   Creating, editing and deleting
Library         SeleniumLibrary  timeout=5  implicit_wait=0
Library         ReactLibrary
Library         DebugLibrary
Library         OperatingSystem
Library         WebpackLibrary

Resource        ${CURDIR}/resources/env.robot
Resource        ${CURDIR}/resources/common.robot

Suite Setup     Start React and open browser
Suite Teardown  Stop React and close browser


*** Test Cases ***

Create test CV
  Create test user with root user
  Logout and login with test user
  Click Element  MyCV
  Click Element  CreateEmptyCV
  Wait for react  reducer=loader
  Page should contain  Empty CV created

Edit CV fields name, github and techlist
  Wait for react  reducer=loader
  ${TEST_CV_SELECT}=  Execute JavaScript  return document.getElementsByClassName('cv-selector-item')[1].id
  Click Element  ${TEST_CV_SELECT}
  Wait for react  reducer=loader
  ${TEST_CV_NAME_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[0].getElementsByTagName('input')[0].id
  ${TEST_CV_GITHUB_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[0].getElementsByTagName('input')[1].id
  ${TEST_CV_TECHLIST_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[0].getElementsByTagName('input')[2].id
  ${TEST_CV_SAVE_BUTTON}=  Execute JavaScript  return document.getElementsByClassName('form-component')[0].getElementsByTagName('button')[3].id
  Input Text  ${TEST_CV_NAME_FIELD}  -edited
  Input Text  ${TEST_CV_GITHUB_FIELD}  https://github.com/edited
  Input Text  ${TEST_CV_TECHLIST_FIELD}  JavaScript Java Edited
  Click Element  ${TEST_CV_SAVE_BUTTON}
  Wait for react  reducer=loader
  Reload Page
  Page should contain  name-required-edited
  Click Element  Preview
  Wait for react
  Page should contain  https://github.com/edited
  Page should contain  JavaScript Java Edited

Edit contact fields firstname, lastname, email, linkedin, phone, available, address, company, picture
  Click Element  ReturnToEditor
  # TODO: contact test

Delete test CV and test user
  ${TEST_CV_SELECT}=  Execute JavaScript  return document.getElementsByClassName('cv-selector-item')[1].id
  Mouse Over  ${TEST_CV_SELECT}
  ${TEST_CV_DELETE}=  Execute JavaScript  return document.getElementsByClassName('cv-item')[1].getElementsByTagName('button')[0].id
  Click Element  ${TEST_CV_DELETE}
  Wait for react  reducer=loader
  Page should contain  CV name-required-edited deleted
  Delete user  ${TEST_USERNAME}