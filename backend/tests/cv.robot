*** Settings ***

Documentation   Creating, editing and deleting
Library         SeleniumLibrary  timeout=5  implicit_wait=0
Library         ReactLibrary
Library         DebugLibrary
Library         OperatingSystem
Library         WebpackLibrary
Library         BuiltIn

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
  Sleep  500ms
  ${TEST_CV_SELECT}=  Execute JavaScript  return document.getElementsByClassName('cv-selector-item')[1].id
  Click Element  ${TEST_CV_SELECT}
  Wait for react  reducer=loader

Edit CV fields name, github and techlist
  ${NAME_FIELD}=        Find form  0  input  0
  ${GITHUB_FIELD}=      Find form  0  input  1
  ${TECHLIST_FIELD}=    Find form  0  input  2
  ${SAVE_BUTTON}=       Find form  0  button  3
  Input Text  ${NAME_FIELD}  -edited
  Input Text  ${GITHUB_FIELD}  https://github.com/edited
  Input Text  ${TECHLIST_FIELD}  JavaScript Java Edited
  Click Element  ${SAVE_BUTTON}
  Wait for react
  Wait for react  reducer=loader
  # Page should contain  name-required-edited
  Click Element  Preview
  Wait for react
  Wait for react  reducer=loader
  Sleep  200ms
  Page should contain  https://github.com/edited
  Page should contain  JavaScript Java Edited

Edit contact fields firstname, lastname, email, linkedin, phone, available, address, company and picture
  Click Element  ReturnToEditor
  ${FIRSTNAME_FIELD}=   Find form  1  input  0
  ${LASTNAME_FIELD}=    Find form  1  input  1
  ${EMAIL_FIELD}=       Find form  1  input  2
  ${LINKEDIN_FIELD}=    Find form  1  input  3
  ${PHONE_FIELD}=       Find form  1  input  4
  ${AVAILABLE_FIELD}=   Find form  1  input  5
  ${ADDRESS_FIELD}=     Find form  1  input  6
  ${COMPANY_FIELD}=     Find form  1  input  7
  ${PICTURE_FIELD}=     Find form  1  input  8
  ${SAVE_BUTTON}=       Find form  1  button  3
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
  Click Element  Preview
  Wait for react
  Wait for react  reducer=loader
  Sleep  100ms
  Mouse Over  NameInfo
  Page should contain  firstname-required-edited
  Page should contain  lastname-required-edited
  Page should contain  edited@mail.com
  Page should contain link  LinkedinProfile  href=https://www.linkedin.com/in/edite-d-linkedinfield/
  Page should contain  050-0000000
  Page should not contain  2pm - 4pm
  Page should contain  Testaajankatu 9, Helsinki 00100
  Page should not contain  Test Company OY
  Page should contain image  ContactPicture  src=http://localhost:3004/kasvokuva.jpg

Edit profile fields name and content
  Click Element  ReturnToEditor
  Click Element  profileAdd
  ${NAME_FIELD}=        Find form  2  input  0
  ${CONTENT_FIELD}=     Find form  2  textarea  0
  ${SAVE_BUTTON}=       Find form  2  button  3
  Input Text  ${NAME_FIELD}  Edited profile name
  Input Text  ${CONTENT_FIELD}  Edited profile content
  Mouse Over  projectsAdd
  Click Element  ${SAVE_BUTTON}
  Wait for react  reducer=loader
  Click Element  Preview
  Wait for react
  Wait for react  reducer=loader
  Page should not contain  Edited profile name
  Page should contain  Edited profile content

Edit project fields name and content
  Click Element  ReturnToEditor
  Click Element  projectsAdd
  ${NAME_FIELD}=        Find form  3  input  0
  ${CONTENT_FIELD}=     Find form  3  textarea  0
  ${GITHUB_FIELD}=      Find form  3  input  1
  ${SHOWCASE_FIELD}=    Find form  3  input  2
  ${THUMBNAIL_FIELD}=   Find form  3  input  3
  ${SAVE_BUTTON}=       Find form  3  button  3
  Input Text  ${NAME_FIELD}  Edited project name
  Input Text  ${CONTENT_FIELD}  Edited project content
  Input Text  ${GITHUB_FIELD}  https://github.com/rampemus/cvapp
  Input Text  ${SHOWCASE_FIELD}  http://localhost:3000
  Input Text  ${THUMBNAIL_FIELD}  http://localhost:3004/project3.png
  Mouse Over  projectsAdd
  Click Element  ${SAVE_BUTTON}
  Wait for react  reducer=loader
  Click Element  Preview
  Wait for react
  Wait for react  reducer=loader
  Sleep  100ms
  Page should contain  Edited project name
  Page should contain  Edited project content
  ${PROJECT_GITHUB}=  Project card  0  a  0
  ${PROJECT_SHOWCASE}=  Project card  0  a  1
  ${THUMBNAIL_FIELD}=  Project card  0  img  0
  Page should contain link  ${PROJECT_GITHUB}  https://github.com/rampemus/cvapp
  Page should contain link  ${PROJECT_SHOWCASE}  http://localhost:3000
  Page should contain image  ${THUMBNAIL_FIELD}  src=http://localhost:3004/project3.png

Edit reference fields firstname, lastname, email, linkedin, phone, available, address, company and picture
  Click Element  ReturnToEditor
  Click Element  referenceAdd
  ${FIRSTNAME_FIELD}=   Find form  4  input  0
  ${LASTNAME_FIELD}=    Find form  4  input  1
  ${EMAIL_FIELD}=       Find form  4  input  2
  ${LINKEDIN_FIELD}=    Find form  4  input  3
  ${PHONE_FIELD}=       Find form  4  input  4
  ${AVAILABLE_FIELD}=   Find form  4  input  5
  ${ADDRESS_FIELD}=     Find form  4  input  6
  ${COMPANY_FIELD}=     Find form  4  input  7
  ${PICTURE_FIELD}=     Find form  4  input  8
  ${SAVE_BUTTON}=       Find form  4  button  3
  Input Text  ${FIRSTNAME_FIELD}  firstname-reference
  Input Text  ${LASTNAME_FIELD}  lastname-reference-edited
  Input Text  ${EMAIL_FIELD}  editedreference@mail.com
  Input Text  ${LINKEDIN_FIELD}  https://www.linkedin.com/in/edite-d-linkedinfield-reference/
  Input Text  ${PHONE_FIELD}  050-0000001
  Input Text  ${AVAILABLE_FIELD}  1pm - 4pm
  Input Text  ${ADDRESS_FIELD}  Testaajankatu 10, Helsinki 00100
  Input Text  ${COMPANY_FIELD}  Test Company 2 OY
  Input Text  ${PICTURE_FIELD}  http://localhost:3004/kasvokuva2.jpg
  Mouse Over  experienceAdd
  Click Element  ${SAVE_BUTTON}
  Wait for react  reducer=loader
  Click Element  Preview
  Wait for react
  Wait for react  reducer=loader
  Sleep  100ms
  Page should contain  firstname-reference
  Page should contain  lastname-reference
  Page should contain  editedreference@mail.com
  # Page should not contain link  LinkedinProfile  href=https://www.linkedin.com/in/edite-d-linkedinfield-reference/
  Page should contain  050-0000001
  Page should contain  1pm - 4pm
  Page should not contain  Testaajankatu 10, Helsinki 00100
  Page should contain  Test Company 2 OY
  # Page should not contain image  ContactPicture  src=http://localhost:3004/kasvokuva2.jpg

Edit experience fields with long timeFrame
  Click Element  ReturnToEditor
  Click Element  experienceAdd
  ${NAME_FIELD}=            Find form  5  input  0
  ${DESCRIPTION_FIELD}=     Find form  5  textarea  0
  ${START_YEAR_SELECT}=     Find form  5  select  0
  ${START_MONTH_SELECT}=    Find form  5  select  1
  ${START_DAY_SELECT}=      Find form  5  select  2
  ${END_YEAR_SELECT}=       Find form  5  select  3
  ${END_MONTH_SELECT}=      Find form  5  select  4
  ${END_DAY_SELECT}=        Find form  5  select  5
  ${SAVE_BUTTON}=           Find form  5  button  3
  Input Text  ${NAME_FIELD}  Edited experience name
  Select From List By Value  ${START_YEAR_SELECT}  2007
  Select From List By Value  ${START_MONTH_SELECT}  11
  Select From List By Value  ${START_DAY_SELECT}  20
  Select From List By Value  ${END_YEAR_SELECT}  2012
  Select From List By Value  ${END_MONTH_SELECT}  4
  Select From List By Value  ${END_DAY_SELECT}  25
  Input Text  ${DESCRIPTION_FIELD}  Edited experience description
  Mouse Over  educationAdd
  Click Element  ${SAVE_BUTTON}
  Wait for react  reducer=loader
  Click Element  Preview
  Wait for react
  Wait for react  reducer=loader
  Sleep  100ms
  Page should not contain  Edited experience name
  Page should contain  2007
  Page should contain  2012
  Page should contain  Edited experience description

Edit education fields with short timeFrame
  Click Element  ReturnToEditor
  Click Element  educationAdd
  ${NAME_FIELD}=            Find form  6  input  0
  ${DESCRIPTION_FIELD}=     Find form  6  textarea  0
  ${START_YEAR_SELECT}=     Find form  6  select  0
  ${START_MONTH_SELECT}=    Find form  6  select  1
  ${START_DAY_SELECT}=      Find form  6  select  2
  ${END_YEAR_SELECT}=       Find form  6  select  3
  ${END_MONTH_SELECT}=      Find form  6  select  4
  ${END_DAY_SELECT}=        Find form  6  select  5
  ${SAVE_BUTTON}=           Find form  6  button  3
  Input Text  ${NAME_FIELD}  Edited education name
  Select From List By Value  ${START_YEAR_SELECT}  2013
  Select From List By Value  ${START_MONTH_SELECT}  2
  Select From List By Value  ${START_DAY_SELECT}  20
  Select From List By Value  ${END_YEAR_SELECT}  2013
  Select From List By Value  ${END_MONTH_SELECT}  3
  Select From List By Value  ${END_DAY_SELECT}  25
  Input Text  ${DESCRIPTION_FIELD}  Edited education description
  Mouse Over  communicationAdd
  Click Element  ${SAVE_BUTTON}
  Wait for react  reducer=loader
  Click Element  Preview
  Wait for react
  Wait for react  reducer=loader
  Sleep  100ms
  Page should not contain  Edited education name
  Page should contain  2013/3
  Page should contain  2013/4
  Page should contain  Edited education description

Edit communication fields name, language and content
  Click Element  ReturnToEditor
  Click Element  communicationAdd
  ${NAME_FIELD}=        Find form  7  input  0
  ${CONTENT_FIELD}=     Find form  7  textarea  0
  ${ADD_LANGUAGE}=      Find form  7  button  0
  ${SAVE_BUTTON}=       Find form  7  button  4
  Input Text  ${NAME_FIELD}  Edited communication name
  Mouse Over  skillsAdd
  Click Element  ${ADD_LANGUAGE}
  ${LANGUAGE_NAME}=     Find form  7  input  1
  ${LANGUAGE_LEVEL}=    Find form  7  select  0
  Input Text  ${LANGUAGE_NAME}  Languine
  Select From List By Value  ${LANGUAGE_LEVEL}  Working proficiency
  Input Text  ${CONTENT_FIELD}  Edited communication content
  Click Element  ${SAVE_BUTTON}
  Wait for react  reducer=loader
  Click Element  Preview
  Wait for react
  Wait for react  reducer=loader
  Sleep  100ms
  Page should not contain  Edited communication name
  Page should contain  Languine
  Page should contain  Working proficiency
  Page should contain  Edited communication content

Edit other skills fields name and content
  Click Element  ReturnToEditor
  Click Element  skillsAdd
  Sleep  20ms
  ${NAME_FIELD}=        Find form  8  input  0
  ${CONTENT_FIELD}=     Find form  8  textarea  0
  ${SAVE_BUTTON}=       Find form  8  button  3
  Input Text  ${NAME_FIELD}  Edited skills name
  Input Text  ${CONTENT_FIELD}  Edited skills content
  Mouse Over  attachmentsAdd
  Click Element  ${SAVE_BUTTON}
  Wait for react  reducer=loader
  Click Element  Preview
  Wait for react
  Wait for react  reducer=loader
  Sleep  100ms
  Page should not contain  Edited skills name
  Page should contain  Edited skills content

Edit info fields name and content
  Click Element  ReturnToEditor
  Sleep  200ms
  Click Element  infoAdd
  ${NAME_FIELD}=        Find form  9  input  0
  ${CONTENT_FIELD}=     Find form  9  textarea  0
  ${SAVE_BUTTON}=       Find form  9  button  3
  Input Text  ${NAME_FIELD}  Edited info name
  Input Text  ${CONTENT_FIELD}  Edited info content
  Mouse Over  attachmentsAdd
  Click Element  ${SAVE_BUTTON}
  Wait for react  reducer=loader
  Click Element  Preview
  Wait for react
  Wait for react  reducer=loader
  Page should not contain  Edited info name
  # Page should contain  Edited info content

Edit attachments fields name and content
  Click Element  ReturnToEditor
  Click Element  attachmentsAdd
  Sleep  200ms
  ${NAME_FIELD}=        Find form  10  input  0
  ${CONTENT_FIELD}=     Find form  10  textarea  0
  ${SAVE_BUTTON}=       Find form  10  button  3
  Input Text  ${NAME_FIELD}  Edited info name
  Input Text  ${CONTENT_FIELD}  Edited info content
  Mouse Over  EndOfPage
  Click Element  ${SAVE_BUTTON}
  Wait for react  reducer=loader
  Click Element  Preview
  Wait for react
  Wait for react  reducer=loader
  Sleep  100ms
  Page should not contain  Edited info name
  Page should contain  Edited info content

Delete test CV and test user
  Go to  ${SERVER}/mycv/
  Wait for react
  Wait for react  reducer=loader
  Sleep  100ms
  ${TEST_CV_SELECT}=  Execute JavaScript  return document.getElementsByClassName('cv-selector-item')[1].id
  Click Element  ${TEST_CV_SELECT}
  Wait for react  reducer=loader
  ${TEST_CV_SELECT}=  Selector item  1
  Mouse Over  ${TEST_CV_SELECT}
  ${TEST_CV_DELETE}=  Selector delete  1
  Click Element  ${TEST_CV_DELETE}
  Wait for react  reducer=loader
  Sleep  100ms
  Page should contain  CV name-required-edited deleted
  Delete user  ${TEST_USERNAME}
