# CV-app

CV application to show CV data

## Installation

Make sure you have yarn/node installed and follow the instructions for installing [frontend](https://github.com/rampemus/cvapp/tree/master/frontend).

Backend can be installed the same way running:

`yarn install`

For local mongoDB follow instructions from [here](https://docs.mongodb.com/manual/administration/install-community/) to install community version or if you are a Mac and have homebrew installed, just run:

`brew install mongodb-community@4.2`

Local mongoDB-server for newer versions of iOS works simply, if you create empty "data" folder in your users folder. Starting up the server then will work just by running:

`$ mongod --dbpath=/Users/<your_username>/data/`

Once mongoDB is up and running the development servers start up for frontend according to [these](https://github.com/rampemus/cvapp/tree/master/frontend) instructions and backend nodemon starts watching the changes by running:

`yarn watch`

in the backend-folder.
