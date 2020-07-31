*** Variables ***

${HOST}       127.0.0.1
${PORT}       3004
${BROWSER}    headlesschrome
${SERVER}     http://${HOST}:${PORT}

*** Keywords ***

Start React and Open Browser
    Run Keyword If     '${PORT}' == '3004'    Run Keyword And Ignore Error    Start Webpack    npm run start:tsnode --scripts-prepend-node-path    check=Server running on port ${PORT}
    Open Browser       ${SERVER}              ${BROWSER}
    Set Window Size    1280                   1024

Stop React and Close Browser
    Run Keyword If    '${PORT}' == '3004'    Run Keyword And Ignore Error    Stop Webpack
    Close Browser

Login
    [Arguments]       ${LOGIN_USERNAME}     ${LOGIN_PASSWORD}
    Go to             ${SERVER}
    Wait for react
    Input Text        username              ${LOGIN_USERNAME}
    Input Text        password              ${LOGIN_PASSWORD}
    Click Element     RememberMeCheckbox
    Click Element     login 

Navigate to user editor
    [Arguments]       ${NAVIGATE_USERNAME}
    Go to             ${SERVER}/users/
    Wait for react    reducer=loader
    Click Element     LinkTo${NAVIGATE_USERNAME}
    Wait for react    reducer=loader
    Click Element     EditUser

Navigate to user creator
    Go to             ${SERVER}/users/
    Wait for react    reducer=loader
    Click Element     AddUser
    Wait for react    reducer=loader

Create test user with root user
    Login                       ${USERNAME}           ${PASSWORD}
    Wait for react              reducer=loader
    Navigate to user creator
    Page should contain         Create new user
    Input Text                  NewUserFullName       ${TEST_USERFULLNAME}
    Input Text                  NewUserName           ${TEST_USERNAME}
    Input Text                  NewPassword           ${TEST_PASSWORD}
    Input Text                  NewPasswordConfirm    ${TEST_PASSWORD}
    Click Element               SubmitUserForm
    Wait for react              reducer=loader

Find form
    [Arguments]       ${FORM_COMPONENT}     ${TAG_TYPE}                                                                                                                     ${FIELD}
    ${ELEMENT_ID}=    Execute JavaScript    return document.getElementsByClassName('form-component')[${FORM_COMPONENT}].getElementsByTagName('${TAG_TYPE}')[${FIELD}].id
    [Return]          ${ELEMENT_ID}

Selector item
    [Arguments]       ${CV}
    ${ELEMENT_ID}=    Execute JavaScript    return document.getElementsByClassName('cv-selector-item')[${CV}].id
    [Return]          ${ELEMENT_ID} 

Selector delete
    [Arguments]       ${CV}
    ${ELEMENT_ID}=    Execute JavaScript    return document.getElementsByClassName('cv-item')[${CV}].getElementsByTagName('button')[0].id
    [Return]          ${ELEMENT_ID} 

Project card
    [Arguments]       ${PROJECT}            ${TAG}                                                                                                              ${ELEMENT}
    ${ELEMENT_ID}=    Execute JavaScript    return document.getElementsByClassName('project-card')[${PROJECT}].getElementsByTagName('${TAG}')[${ELEMENT}].id
    [Return]          ${ELEMENT_ID}

Logout and login with test user
    Click Element     Logout
    Login             ${TEST_USERNAME}    ${TEST_PASSWORD}
    Wait for react    reducer=loader

Logout and login with root user
    Click Element     Logout
    Login             ${USERNAME}       ${PASSWORD}
    Wait for react    reducer=loader

Delete user
    [Arguments]       ${DELETE_USERNAME}
    Click Element     Users
    Wait for react    reducer=loader
    Sleep             200ms
    Mouse Over        LinkTo${DELETE_USERNAME}
    Click Element     Delete${DELETE_USERNAME}
    Wait for react    reducer=loader