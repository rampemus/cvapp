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

Login with Root User
  Go to  ${SERVER}
  Wait for react
  Input Text  username  ${USERNAME}
  Input Text  password  ${PASSWORD}
  Click Element  RememberMeCheckbox
  Click Element  login

Login with Test User
  Go to  ${SERVER}
  Wait for react
  Input Text  username  ${TEST_USERNAME}
  Input Text  password  ${TEST_PASSWORD}
  Click Element  RememberMeCheckbox
  Click Element  login