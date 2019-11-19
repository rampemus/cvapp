import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import loginRouter from './controllers/login'
import usersRouter from './controllers/users'
import { MONGODB_URI, PORT } from './utils/config'

const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose.set('useCreateIndex', true)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch( ( error: mongoose.Error ) => {
    console.log('Internet down or connection refused from mongodb')
    console.log(error.name)
    process.exit(1)
  })

app.get('/', (request, respond) => {
    respond.send('<h1>Hello world</h1>')
})

app.use('/api/login', loginRouter)
// TODO: check tokens middleware
app.use('/api/users', usersRouter)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
