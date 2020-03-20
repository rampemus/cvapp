*** Variables ***

${HOST}                 127.0.0.1
${PORT}                 3000
${BROWSER}              headlesschrome
${SERVER}               http://${HOST}:${PORT}


*** Settings ***

Documentation   ReactLibrary Acceptance Tests
Library         SeleniumLibrary  timeout=5  implicit_wait=0
Library         ReactLibrary
Library         DebugLibrary
Library         OperatingSystem
Library         WebpackLibrary

Suite Setup     Start React and open browser
Suite Teardown  Stop React and close browser


*** Test Cases ***

Scenario: Wait for react keyword waits for loading
  Go to  ${SERVER}
  Wait for react
  Page should contain  Username
  Page should contain  Password
  Page should contain  Remember me


*** Keywords ***

Start React and Open Browser
  Set environment variable  BROWSER  none
  Start Webpack  yarn start
  Open Browser  ${SERVER}  ${BROWSER}
  Set Window Size  1280  1024

Stop React and Close Browser
  # stop react

  Stop Webpack
  Close Browser