const express = require('express')
const router = express.Router()
const configController = require('../controllers/configController')

router.post('/create-table', configController.createTable)
router.get('/list-tables', configController.listTables)

module.exports = router
