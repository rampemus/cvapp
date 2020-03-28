*** Variables ***

${HOST}                 127.0.0.1
${PORT}                 3004
${BROWSER}              headlesschrome
${SERVER}               http://${HOST}:${PORT}


*** Keywords ***

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
