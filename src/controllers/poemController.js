require('dotenv').config()
const { validationResult } = require('express-validator')
const { Pool } = require('pg')
const sanitizeUserInput = require('../utils/sanitizeUserInput')
const validateInput = require('../middlewares/validateInput')

const pool = new Pool({
  connectionString: process.env.EXTERNAL_DB_URL,
  ssl: { rejectUnauthorized: false }
})

// Route to add a new poem to the 'poems' table
const create = async (req, res) => {
  const client = await pool.connect() // Connect to the database

  try {
    await client.query('BEGIN') // Start a transaction

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, author, content } = req.body // Get the title, author and content from the request body

    // Sanitize the title, author and content to prevent XSS attacks
    const sanitizedTitle = sanitizeUserInput(title)
    const sanitizedAuthor = sanitizeUserInput(author)
    const sanitizedContent = sanitizeUserInput(content)

    // Query SQL to insert a new poem into the 'poems' table
    const insertQuery = `
      INSERT INTO poems (title, author, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id;
    `

    const result = await client.query(insertQuery, [sanitizedTitle, sanitizedAuthor, sanitizedContent])
    const { id } = result.rows[0]

    await client.query('COMMIT') // Commit the transaction

    res.json({ id, message: 'Poem added successfully' })
  } catch (error) {
    await client.query('ROLLBACK') // Rollback the transaction if an error occurred

    console.error('Error adding poem:', error)
    res.status(500).json({ error: 'Error adding poem' })
  } finally {
    client.release() // Release the connection to the database
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
  const client = await pool.connect() // Connect to the database

  try {
    await client.query('BEGIN') // Start a transaction

    const { id } = req.params
    const { title, author, content } = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const client = await pool.connect()

    // Sanitize input fields
    const sanitizedTitle = sanitizeUserInput(title)
    const sanitizedAuthor = sanitizeUserInput(author)
    const sanitizedContent = sanitizeUserInput(content)

    // Query SQL to update a poem in the 'poems' table
    const updateQuery = `
      UPDATE poems
      SET title = COALESCE($1, title), author = COALESCE($2, author), content = COALESCE($3, content)
      WHERE id = $4
    `
    await client.query(updateQuery, [sanitizedTitle, sanitizedAuthor, sanitizedContent, id])

    await client.query('COMMIT') // Commit the transaction

    res.json({ message: 'Poem updated successfully' })
  } catch (error) {
    await client.query('ROLLBACK') // Rollback the transaction if an error occurred

    console.error('Error updating poem:', error)
    res.status(500).json({ error: 'Error updating poem' })
  } finally {
    client.release() // Release the connection to the database
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
  create: [
    // Use the validateInput middleware to validate the request body
    validateInput(['title', 'author', 'content']),
    create
  ],
  read,
  update,
  remove
}
