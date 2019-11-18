import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { MONGODB_URI, PORT } from './utils/config'

const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose.set('useCreateIndex', true)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.get('/', (request, respond) => {
    respond.send('<h1>Hello world</h1>')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
