# CV-app

CV application to show CV data

## Installation

Make sure you have yarn/node installed and follow the instructions for installing [frontend](https://github.com/rampemus/cvapp/tree/master/frontend).

Backend can be installed the same way running:

`yarn install`

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

Local mongoDB-server for newest iOS works by simply creating "data" folder in your users folder. Starting up the db will then work just by running:

`mongod --dbpath=/Users/<your_username>/data/`

## Running development version

Once mongoDB is up and running the development servers start up for frontend according to [these](https://github.com/rampemus/cvapp/tree/master/frontend) instructions and backend nodemon starts watching the changes by running:

`npm run start:tsnode`

in the backend-folder.

## Running tests

Jest tests can be run from backend-folder:

`yarn test:jest`

And end-to-end tests with current UI build will run also from backend-folder:

`robot -d results tests`

Requirements for robotframework need to be installed manually for now:

`pip3 install robotframework robotframework-debuglibrary robotframework-react robotframework-seleniumlibrary robotframework-webpack`

Test can be run only if development environment is up.