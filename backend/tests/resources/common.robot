*** Variables ***

${HOST}                 127.0.0.1
${PORT}                 3004
${BROWSER}              headlesschrome
${SERVER}               http://${HOST}:${PORT}


*** Keywords ***

Start React and Open Browser
  Run Keyword If  '${PORT}' == '3004'  Run Keyword And Ignore Error  Start Webpack  npm run start:tsnode --scripts-prepend-node-path  check=Server running on port ${PORT}
  Open Browser  ${SERVER}  ${BROWSER}
  Set Window Size  1280  1024

Stop React and Close Browser
  Run Keyword If  '${PORT}' == '3004'  Run Keyword And Ignore Error  Stop Webpack
  Close Browser

Login
  [Arguments]  ${LOGIN_USERNAME}  ${LOGIN_PASSWORD}
  Go to  ${SERVER}
  Wait for react
  Input Text  username  ${LOGIN_USERNAME}
  Input Text  password  ${LOGIN_PASSWORD}
  Click Element  RememberMeCheckbox
  Click Element  login 

Navigate to user editor
  [Arguments]  ${NAVIGATE_USERNAME}
  Go to  ${SERVER}/users/
  Wait for react  reducer=loader
  Click Element  LinkTo${NAVIGATE_USERNAME}
  Wait for react  reducer=loader
  Click Element  EditUser

Navigate to user creator
  Go to  ${SERVER}/users/
  Wait for react  reducer=loader
  Click Element  AddUser
  Wait for react  reducer=loader