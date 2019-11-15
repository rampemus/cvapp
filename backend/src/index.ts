
import express from 'express'
const app = express()

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
