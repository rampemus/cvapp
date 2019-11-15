import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (request, respond) => {
  respond.send('<h1>Hello world</h1>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
