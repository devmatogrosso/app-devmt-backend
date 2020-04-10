/*
    App DevMT - Backend
*/
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const jobs = require('./jobs')

// Configurar Express
const app = express()
app.use(bodyParser.json())
app.use(helmet())

// Jobs
app.use('/jobs', jobs)

// Iniciar backend
exports.backend = app

if (process.env.NODE_ENV !== "production") {
    app.listen(process.env.PORT || 8080)
}
