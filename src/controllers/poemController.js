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

// Route to update a poem in the 'poems' table
const update = async (req, res) => {
  const client = await pool.connect() // Connect to the database

  try {
    await client.query('BEGIN') // Start a transaction

    const { id } = req.params

    // Check if the poem with the specified ID exists before updating it
    const checkPoemQuery = `
      SELECT id FROM poems
      WHERE id = $1
    `
    const checkResult = await client.query(checkPoemQuery, [id])

    // If the poem with the specified ID doesn't exist, return a 404 error
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Poem not found' })
    }

    const { title, author, content } = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const updateFields = [] // Array to store fields to be updated
    const values = [] // Array to store corresponding values

    // Check if each property is present in the request body and add it to the updateFields and values arrays
    if (title !== undefined) {
      updateFields.push('title')
      values.push(sanitizeUserInput(title))
    }

    if (author !== undefined) {
      updateFields.push('author')
      values.push(sanitizeUserInput(author))
    }

    if (content !== undefined) {
      updateFields.push('content')
      values.push(sanitizeUserInput(content))
    }

    // Construct the dynamic update query based on the fields provided
    const updateQuery = `
      UPDATE poems
      SET ${updateFields.map((field, index) => `${field} = $${index + 1}`).join(', ')}
      WHERE id = $${updateFields.length + 1}
    `

    await client.query(updateQuery, [...values, id])

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

// Route to delete a poem from the 'poems' table
const remove = async (req, res) => {
  const client = await pool.connect() // Connect to the database

  try {
    await client.query('BEGIN') // Start a transaction

    const { id } = req.params

    // Check if the poem with the specified ID exists before deleting it
    const checkPoemQuery = `
      SELECT id FROM poems
      WHERE id = $1
    `

    const checkResult = await client.query(checkPoemQuery, [id])

    // If the poem with the specified ID doesn't exist, return a 404 error
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Poem not found' })
    }

    // Query SQL to delete a poem from the 'poems' table
    const deleteQuery = `
      DELETE FROM poems
      WHERE id = $1
    `

    await client.query(deleteQuery, [id])

    await client.query('COMMIT') // Commit the transaction

    res.json({ message: 'Poem deleted successfully' })
  } catch (error) {
    await client.query('ROLLBACK') // Rollback the transaction if an error occurred

    console.error('Error deleting poem:', error)
    res.status(500).json({ error: 'Error deleting poem' })
  } finally {
    client.release() // Release the connection to the database
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
