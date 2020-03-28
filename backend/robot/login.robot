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

Login page loads
  Go to  ${SERVER}
  Wait for react
  Page should contain  Username
  Page should contain  Password
  Page should contain  Remember me
  Page should contain button  Login

Login page accepts Username and Password
  Login with Root User
  Wait for react  reducer=loader
  Page should contain  Curriculum Vitae

After login Users MyCV and About are accessible
  Click Element  Users
  Wait for react  reducer=loader
  Page should contain  Created/Expires
  Click Element  MyCV
  Wait for react  reducer=loader
  Page should contain  My CV's
  Click Element  About
  Wait for react  reducer=loader
  Page should contain  Version
