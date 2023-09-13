const fs = require('fs') // Módulo 'fs' para leitura de arquivos
const path = require('path')

// Rota para servir o arquivo HTML (swagger.html)
const serveSwagger = (req, res) => {
  try {
    const swaggerFilePath = path.join(__dirname, './swagger.html')
    const swaggerContent = fs.readFileSync(swaggerFilePath, 'utf8')

    res.status(200).send(swaggerContent)
  } catch (error) {
    console.error('Erro ao servir o arquivo HTML:', error)
    res.status(500).send('Erro ao servir o arquivo HTML')
  }
}

module.exports = {
  serveSwagger
}
