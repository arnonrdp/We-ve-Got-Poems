const express = require('express')
const router = express.Router()
const swaggerController = require('../controllers/swaggerController')

router.get('/', swaggerController.serveSwagger)

module.exports = router
