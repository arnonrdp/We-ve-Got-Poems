const express = require('express')
const { Pool } = require('pg')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

const poemRoutes = require('./routes/poemRoutes')

// Use the imported routes
app.use('/poems', poemRoutes) // All routes in poemRoutes will start with '/poems'

app.listen(port, () => {
  console.log(`Servidor Express está rodando na porta ${port}`)
})

