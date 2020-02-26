import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import cvRouter from './controllers/cv'
import loginRouter from './controllers/login'
import usersRouter from './controllers/users'
import { MONGODB_URI, ROOT_USERNAME } from './utils/config'
import { generateTestCV, userIsCVOwner } from './utils/cvHelper'
import { AuthenticateUser, RequestLogger, TokenExtractor } from './utils/middleware'
import { createRootUser, userExists } from './utils/userHelper'

const app = express()

app.use(cors())
app.use(bodyParser.json())

if (process.env.NODE_ENV !== 'test') {
    mongoose.set('useCreateIndex', true)
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
}

if (process.env.NODE_ENV !== 'test') {
    userExists(ROOT_USERNAME).then((response) => {
        if (!response) {
            createRootUser()
        }
    })
    userIsCVOwner(ROOT_USERNAME).then((result) => {
        if (!result) {
            generateTestCV(ROOT_USERNAME)
        }
    })
}

app.use(express.static('build'))

app.use('/api/login', loginRouter)

app.use(TokenExtractor)
app.use(AuthenticateUser)
if (process.env.NODE_ENV !== 'test') {
    app.use(RequestLogger)
}

app.use('/api/users', usersRouter)
app.use('/api/cv', cvRouter)

export default app
