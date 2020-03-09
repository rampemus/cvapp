#!/bin/zsh
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
npm run test
npm run build
cp -r build ../../heroku-cvapp/build
cp -r dist ../../heroku-cvapp/dist
sed '7,9d' package.json > ../../heroku-cvapp/package.json 
cd ..

cd ../heroku-cvapp
git add .
git commit -am $1
cd ../cvapp