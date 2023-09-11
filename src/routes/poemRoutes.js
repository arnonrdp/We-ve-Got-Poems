const express = require('express')
const router = express.Router()
const poemController = require('../controllers/poemController')

// Routes related to the 'poems' table
router.get('/', poemController.connect)
router.post('/add-poem', poemController.addPoem)
router.get('/get-poems', poemController.getPoems)
router.get('/list-tables', poemController.listTables)


module.exports = router
