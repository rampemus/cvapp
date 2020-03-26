*** Variables ***

${HOST}                 127.0.0.1
${PORT}                 3004
${BROWSER}              chrome
${SERVER}               http://${HOST}:${PORT}


*** Settings ***

Documentation   Login page
Library         SeleniumLibrary  timeout=5  implicit_wait=0
Library         ReactLibrary
Library         DebugLibrary
Library         OperatingSystem
Library         WebpackLibrary

Suite Setup     Start React and open browser
Suite Teardown  Stop React and close browser

Resource        ${CURDIR}/env.robot


*** Test Cases ***

Scenario: Login page loads
  Go to  ${SERVER}
  Wait for react
  Page should contain  Username
  Page should contain  Password
  Page should contain  Remember me
  Page should contain button  Login

Scenario: Login page accepts Username and Password
  Go to  ${SERVER}
  Wait for react
  Input Text  username  ${USERNAME}
  Input Text  password  ${PASSWORD}
  Click Element  login

*** Keywords ***

Start React and Open Browser
  Start Webpack  yarn start  check=Server running on port 3004
  Set environment variable  BROWSER  none
  Open Browser  ${SERVER}  ${BROWSER}
  Set Window Size  1280  1024

Stop React and Close Browser
  # stop react

  Stop Webpack
  Close Browser