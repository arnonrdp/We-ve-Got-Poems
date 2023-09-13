const express = require('express')
const router = express.Router()
const poemController = require('../controllers/poemController')

router.post('/add-poem', poemController.addPoem)
router.get('/get-poems', poemController.getPoems)

module.exports = router
