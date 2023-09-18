const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const configRoutes = require('./routes/configRoutes')
const poemRoutes = require('./routes/poemRoutes')
const swaggerRoute = require('./routes/swaggerRoute')

app.use('/', swaggerRoute)
app.use('/v1', poemRoutes)
app.use('/config', configRoutes)

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`)
})
