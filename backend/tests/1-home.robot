*** Settings ***

Documentation    Creating, editing and deleting
Library          SeleniumLibrary                   timeout=5    implicit_wait=0
Library          ReactLibrary
Library          OperatingSystem
Library          WebpackLibrary
Library          BuiltIn

Resource    ${CURDIR}/resources/env.robot
Resource    ${CURDIR}/resources/common.robot

Suite Setup       Start React and open browser
Suite Teardown    Stop React and close browser


*** Test Cases ***

Create test CV
    Create test user with root user
    Click Element                      MyCV
    Wait for react                     reducer=loader
    Click Element                      CreateEmptyCV
    Wait for react                     reducer=loader
    Page should contain                Empty CV created

Default empty CV
    Click Element         MyCV
    Wait for react        reducer=loader
  # Sleep  500ms
    ${TEST_CV_SELECT}=    Execute JavaScript    return document.getElementsByClassName('cv-selector-item')[1].id
    Click Element         ${TEST_CV_SELECT}
    Click Element         SetAsDefaultCV

Default shows for test user
    Logout and login with test user
    Wait for react                     reducer=loader

Reselect main as default
    Logout and login with root user
    Go to                              ${SERVER}/mycv/
    Wait for react
    Wait for react                     reducer=loader
  # Sleep  100ms
    ${TEST_CV_SELECT}=                 Execute JavaScript    return document.getElementsByClassName('cv-selector-item')[1].id
    Click Element                      ${TEST_CV_SELECT}
    Wait for react                     reducer=loader
    Click Element                      SetAsDefaultCV
    Wait for react                     reducer=loader

Delete test CV and test user
    ${TEST_CV_SELECT}=     Selector item               1
    Mouse Over             ${TEST_CV_SELECT}
    ${TEST_CV_DELETE}=     Selector delete             1
    Click Element          ${TEST_CV_DELETE}
    Wait for react         reducer=loader
  # Sleep  300ms
    Page should contain    CV name-required deleted
    Delete user            ${TEST_USERNAME}
