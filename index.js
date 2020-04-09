/*
    App DevMT - Backend
*/
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')

// Configurar Express
const app = express()
app.use(bodyParser.json())
app.use(helmet())

// GET
app.get('/', (req, res) => {
    res.send("Hello World !")
})

// Iniciar backend
exports.backend = app

if (process.env.NODE_ENV !== "production") {
    app.listen(process.env.PORT || 8080)
}
