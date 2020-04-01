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
  Wait for react  reducer=loader
  Click Element  CreateEmptyCV
  Wait for react  reducer=loader
  Page should contain  Empty CV created

Select empty CV
  ${TEST_CV_SELECT}=  Execute JavaScript  return document.getElementsByClassName('cv-selector-item')[1].id
  Click Element  ${TEST_CV_SELECT}
  Wait for react  reducer=loader

Edit CV fields name, github and techlist
  ${NAME_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[0].getElementsByTagName('input')[0].id
  ${GITHUB_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[0].getElementsByTagName('input')[1].id
  ${TECHLIST_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[0].getElementsByTagName('input')[2].id
  ${SAVE_BUTTON}=  Execute JavaScript  return document.getElementsByClassName('form-component')[0].getElementsByTagName('button')[3].id
  Input Text  ${NAME_FIELD}  -edited
  Input Text  ${GITHUB_FIELD}  https://github.com/edited
  Input Text  ${TECHLIST_FIELD}  JavaScript Java Edited
  Click Element  ${SAVE_BUTTON}
  Wait for react  reducer=loader
  Reload Page
  Wait for react
  Wait for react  reducer=loader
  Page should contain  name-required-edited
  Click Element  Preview
  Wait for react
  Page should contain  https://github.com/edited
  Page should contain  JavaScript Java Edited

Edit contact fields firstname, lastname, email, linkedin, phone, available, address, company and picture
  Click Element  ReturnToEditor
  ${FIRSTNAME_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[1].getElementsByTagName('input')[0].id
  ${LASTNAME_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[1].getElementsByTagName('input')[1].id
  ${EMAIL_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[1].getElementsByTagName('input')[2].id
  ${LINKEDIN_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[1].getElementsByTagName('input')[3].id
  ${PHONE_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[1].getElementsByTagName('input')[4].id
  ${AVAILABLE_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[1].getElementsByTagName('input')[5].id
  ${ADDRESS_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[1].getElementsByTagName('input')[6].id
  ${COMPANY_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[1].getElementsByTagName('input')[7].id
  ${PICTURE_FIELD}=  Execute JavaScript  return document.getElementsByClassName('form-component')[1].getElementsByTagName('input')[8].id
  ${SAVE_BUTTON}=  Execute JavaScript  return document.getElementsByClassName('form-component')[1].getElementsByTagName('button')[3].id
  Input Text  ${FIRSTNAME_FIELD}  -edited
  Input Text  ${LASTNAME_FIELD}  -edited
  Input Text  ${EMAIL_FIELD}  edited@mail.com
  Input Text  ${LINKEDIN_FIELD}  https://www.linkedin.com/in/edite-d-linkedinfield/
  Input Text  ${PHONE_FIELD}  050-0000000
  Input Text  ${AVAILABLE_FIELD}  2pm - 4pm
  Input Text  ${ADDRESS_FIELD}  Testaajankatu 9, Helsinki 00100
  Input Text  ${COMPANY_FIELD}  Test Company OY
  Input Text  ${PICTURE_FIELD}  http://localhost:3004/kasvokuva.jpg
  Click Element  ${SAVE_BUTTON}
  Wait for react  reducer=loader
  Reload Page
  Click Element  Preview
  Wait for react
  Wait for react  reducer=loader
  Page should contain  firstname-required-edited
  Page should contain  lastname-required-edited
  Page should contain  edited@mail.com
  Page should contain link  LinkedinProfile  href=https://www.linkedin.com/in/edite-d-linkedinfield/
  Page should contain  050-0000000
  Page should not contain  2pm - 4pm
  Page should contain  Testaajankatu 9, Helsinki 00100
  Page should not contain  Test Company OY
  Page should contain image  ContactPicture  src=http://localhost:3004/kasvokuva.jpg

Delete test CV and test user
  Click Element  ReturnToEditor
  ${TEST_CV_SELECT}=  Execute JavaScript  return document.getElementsByClassName('cv-selector-item')[1].id
  Mouse Over  ${TEST_CV_SELECT}
  ${TEST_CV_DELETE}=  Execute JavaScript  return document.getElementsByClassName('cv-item')[1].getElementsByTagName('button')[0].id
  Click Element  ${TEST_CV_DELETE}
  Wait for react  reducer=loader
  Page should contain  CV name-required-edited deleted
  Delete user  ${TEST_USERNAME}