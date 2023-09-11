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
    res.send(`O servidor PostgreSQL está online e a hora atual é: ${currentTime}`)
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error)
    res.status(500).send('Erro ao conectar ao banco de dados')
  }
}

// Route to create the 'poems' table
const createTable = async (req, res) => {
  try {
    const client = await pool.connect()

    // Query SQL to create the 'poems' table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS poems (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        content TEXT NOT NULL
      );
    `

    await client.query(createTableQuery)
    client.release()

    res.send('Tabela "poems" criada com sucesso!')
  } catch (error) {
    console.error('Erro ao criar a tabela "poems":', error)
    res.status(500).send('Erro ao criar a tabela "poems"')
  }
}

const listTables = async (req, res) => {
  try {
    const client = await pool.connect()

    // Query SQL to list all tables from the database
    const listTablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `

    const result = await client.query(listTablesQuery)
    const tables = result.rows.map((row) => row.table_name)
    client.release()

    res.json(tables)
  } catch (error) {
    console.error('Erro ao listar tabelas:', error)
    res.status(500).json({ error: 'Erro ao listar tabelas' })
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
  createTable,
  listTables,
  addPoem,
  getPoems
}
