import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
// tslint:disable-next-line: no-var-requires
const expressSanitizer = require('express-sanitizer')
import mongoose from 'mongoose'
import cvRouter from './controllers/cv'
import loginRouter from './controllers/login'
import usersRouter from './controllers/users'
import { MONGODB_URI } from './utils/config'
import { initializeRootUserAndCV } from './utils/cvHelper'
import { AuthenticateUser, RequestLogger, TokenExtractor } from './utils/middleware'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(compression())
app.use(expressSanitizer())

if (process.env.NODE_ENV !== 'test') {
  mongoose.set('useCreateIndex', true)
  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
}

if (process.env.NODE_ENV !== 'test') {
  initializeRootUserAndCV()
}

if (process.env.NODE_ENV === 'production') {
  app.use('/showcase', express.static('opetussivusto'))
}

const build = express.static('build')
app.use('/', build)
app.use('/users', build)
app.use('/users/:id', build)
app.use('/mycv', build)
app.use('/mycv/:id', build)
app.use('/preview/:id', build)
app.use('/about', build)

app.use('/api/login', loginRouter)

app.use(TokenExtractor)
app.use(AuthenticateUser)
if (process.env.NODE_ENV !== 'test') {
  app.use(RequestLogger)
}

app.use('/api/users', usersRouter)
app.use('/api/cv', cvRouter)

export default app
