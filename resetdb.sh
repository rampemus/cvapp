mongo <<EOF
use cv-app 
db.runCommand( { dropDatabase: 1 } )
use cv-app-test
db.runCommand( { dropDatabase: 1 } )
quit()
exit
EOF
mongod --logpath ~/Logs/mongodb.log --dbpath=/Users/rampemus/data/