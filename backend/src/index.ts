import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Request, Response} from 'express'
import mongoose from 'mongoose'
import cvRouter from './controllers/cv'
import loginRouter from './controllers/login'
import usersRouter from './controllers/users'
import { MONGODB_URI, PORT, ROOT_USERNAME } from './utils/config'
import { AuthenticateUser, RequestLogger, TokenExtractor } from './utils/middleware'
import { createRootUser, userExists } from './utils/userHelper'

const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose.set('useCreateIndex', true)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

userExists(ROOT_USERNAME).then((response) => {
  if ( !response ) {
    createRootUser()
  }
})

app.get('/', ( request: Request, respone: Response) => {
  respone.status(200).send('<h1>Hello world</h1><p>frontend is not yet here</p>')
})

app.use('/api/login', loginRouter)

app.use(TokenExtractor)
app.use(AuthenticateUser)
app.use(RequestLogger)

app.use('/api/users', usersRouter)
app.use('/api/cv', cvRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
