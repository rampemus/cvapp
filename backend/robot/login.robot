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

*** Keywords ***

Start React and Open Browser
  Start Webpack  npm run start:tsnode --scripts-prepend-node-path  check=Server running on port 3004
  Set environment variable  BROWSER  none
  Open Browser  ${SERVER}  ${BROWSER}
  Set Window Size  1280  1024

Stop React and Close Browser
  Stop Webpack
  Close Browser