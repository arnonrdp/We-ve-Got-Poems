const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.EXTERNAL_DB_URL,
  ssl: { rejectUnauthorized: false }
})

// Route to test the connection with the database
const connect = async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW() as current_time')
    const currentTime = result.rows[0].current_time
    client.release()
    res.send(`The PostgreSQL server is online and the current time is: ${currentTime}`)
  } catch (error) {
    console.error('Error connecting to database:', error)
    res.status(500).send('Error connecting to database')
  }
}

// Route to add a new poem to the 'poems' table
const addPoem = async (req, res) => {
  try {
    const { title, author, content } = req.body // Extracts the data from the request body

    const client = await pool.connect()

    // Query SQL to insert a new poem into the 'poems' table
    const insertQuery = `
      INSERT INTO poems (title, author, content)
      VALUES ($1, $2, $3)
      RETURNING id;
    `

    const result = await client.query(insertQuery, [title, author, content])
    const poemId = result.rows[0].id
    client.release()

    res.json({ message: 'Poema adicionado com sucesso', poemId })
  } catch (error) {
    console.error('Erro ao adicionar o poema:', error)
    res.status(500).json({ error: 'Erro ao adicionar o poema' })
  }
}

// Route to get all poems from the 'poems' table
const getPoems = async (req, res) => {
  try {
    const client = await pool.connect()

    // Query SQL to get all poems from the 'poems' table
    const selectQuery = 'SELECT * FROM poems'

    const result = await client.query(selectQuery)
    const poems = result.rows
    client.release()

    res.json(poems)
  } catch (error) {
    console.error('Erro ao obter os poemas:', error)
    res.status(500).json({ error: 'Erro ao obter os poemas' })
  }
}

module.exports = {
  connect,
  addPoem,
  getPoems
}
