#!/bin/bash

if [ -z "$1" ]; then
    echo 'Commit message as an argument required'
    exit 0
fi

cd ../heroku-cvapp
heroku login
rm -rf build
rm -rf dist
rm package.json
cd ../cvapp

cd backend
rm -rf build
cd ..

cd frontend
npm run build
cp -r build ../backend/build
cd ..

cd backend
npm run test || exit 0
npm run build
cp -r build ../../heroku-cvapp/build
cp -r dist ../../heroku-cvapp/dist
sed '7,10d' package.json > ../../heroku-cvapp/package.json
cd ..

cd ../heroku-cvapp
git add .
git commit -am '$1'
git push heroku master
cd ../cvapp
