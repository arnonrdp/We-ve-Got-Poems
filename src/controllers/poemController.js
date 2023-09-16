const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.EXTERNAL_DB_URL,
  ssl: { rejectUnauthorized: false }
})

// Route to add a new poem to the 'poems' table
const create = async (req, res) => {
  try {
    const { title, author, content } = req.body // Extracts the data from the request body

    const client = await pool.connect()

    // Query SQL to insert a new poem into the 'poems' table
    const insertQuery = `
      INSERT INTO poems (title, author, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id;
    `

    const result = await client.query(insertQuery, [title, author, content])
    const { id } = result.rows[0]
    client.release()

    res.json({ id, message: 'Poem added successfully' })
  } catch (error) {
    console.error('Error adding poem:', error)
    res.status(500).json({ error: 'Error adding poem' })
  }
}

// Route to get all poems from the 'poems' table
const read = async (req, res) => {
  try {
    const client = await pool.connect()

    // Query SQL to get all poems from the 'poems' table
    const selectQuery = 'SELECT * FROM poems'

    const result = await client.query(selectQuery)
    const poems = result.rows
    client.release()

    res.json(poems)
  } catch (error) {
    console.error('Error getting poems:', error)
    res.status(500).json({ error: 'Error getting poems' })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { title, author, content } = req.body

    const client = await pool.connect()

    // Query SQL to update a poem from the 'poems' table
    const updateQuery = `
      UPDATE poems
      SET title = COALESCE($1, title), author = COALESCE($2, author), content = COALESCE($3, content)
      WHERE id = $4
    `
    await client.query(updateQuery, [title, author, content, id])
    client.release()

    res.json({ message: 'Poem updated successfully' })
  } catch (error) {
    console.error('Error updating poem:', error)
    res.status(500).json({ error: 'Error updating poem' })
  }
}

const remove = async (req, res) => {
  try {
    const { id } = req.params

    const client = await pool.connect()

    // Query SQL to delete a poem from the 'poems' table
    const deleteQuery = `
      DELETE FROM poems
      WHERE id = $1
    `

    await client.query(deleteQuery, [id])
    client.release()

    res.json({ message: 'Poem deleted successfully' })
  } catch (error) {
    console.error('Error deleting poem:', error)
    res.status(500).json({ error: 'Error deleting poem' })
  }
}

module.exports = {
  create,
  read,
  update,
  remove
}
