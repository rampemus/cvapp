# CV-app

Application to show CV data

## Installation

Make sure you have yarn/npm installed and follow the instructions for installing [frontend](https://github.com/rampemus/cvapp/tree/master/frontend).

Backend can be installed the same way running:

`npm install`

Define required environmental variables:

`ROOT_USERNAME`

`ROOT_PASSWORD`

`ROOT_NAME`

`MONGODB_URI=mongodb://127.0.0.1:27017/cv-app`

`MONGODB_URI_TEST=mongodb://127.0.0.1:27017/cv-app-test`

`JWT_SALT`

`PASSWORD_DIGITS=abcdefg...`

You can write these also in .env-file.

For local mongoDB follow instructions from [here](https://docs.mongodb.com/manual/administration/install-community/) to install community version. IF you are on Mac and have homebrew installed, just run:

`brew install mongodb-community`

Local mongoDB-server for newest iOS works using "data" folder in your users folder (make sure data folder exists before running db). Starting up the db will then work just by running:

`mongod --dbpath=/Users/<your_username>/data/`

## Running development version

Once mongoDB is up and running the development servers start up for frontend according to [these](https://github.com/rampemus/cvapp/tree/master/frontend) instructions and backend nodemon starts watching the changes by running:

`npm run start:tsnode`

in the backend-folder. Backend also serves last built frontend from the dist-folder.

## Running tests

Jest tests can be executed from backend-folder:

`npm run test:jest`

And end-to-end tests with current UI build (or from running frontend) can be executed with the script:

`npm run test:robot`

All tests will execute running:

`npm run test`

Robot tests can be run using global installation:

```
robot -d results tests

# execute test suite by filepath
robot -d results tests/0-login.robot

# execute test cases separately
robot -d results --test "Login page loads" tests
```

## Test requirements

Requirements for robotframework need to be installed manually for now:

```
pip3 install robotframework robotframework-debuglibrary robotframework-react robotframework-seleniumlibrary robotframework-webpack
```
