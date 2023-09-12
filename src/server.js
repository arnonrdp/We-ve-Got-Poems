const express = require('express')
const { Pool } = require('pg')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

const configRoutes = require('./routes/configRoutes')
const poemRoutes = require('./routes/poemRoutes')

app.use('/', poemRoutes)
app.use('/config', configRoutes)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})

