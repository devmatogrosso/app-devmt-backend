/*
    Jobs
*/
const express = require('express')
const oauth = require('./oauth')
const axios = require('axios').default
const router = express.Router()

const {
    GITHUB_REPOSITORY,
    GITHUB_OAUTH_TOKEN,
    APP_CLIENT_ID,
    APP_CLIENT_SECRET
} = process.env

// GitHub OAuth
router.use('/oauth', oauth)

// Listar jobs
router.get('/', async (req, res) => {
    if (! GITHUB_OAUTH_TOKEN) {
        return res.status(403).send("Unauthorized")
    }

    // Ler issues abertas e com a tag "verificada"
    const response = await axios({
        url: `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues?state=open&labels=verificada`,
        method: 'GET',
        headers: { 'Accept': 'application/vnd.github.v3+json', 'Authorization': `token ${GITHUB_OAUTH_TOKEN}` }
    })

    // Retornar jobs
    res.send({
        jobs: response.data.map((issue) => {
            return {
                number: issue.number,
                title: issue.title,
                body: issue.body,
                created_at: issue.created_at,
                updated_at: issue.updated_at
            }
        })
    })
})

// Obter um job
router.get('/:number', async (req, res) => {
    if (! GITHUB_OAUTH_TOKEN) {
        return res.status(403).send("Unauthorized")
    }

    const { number } = req.params
    if (! number) {
        return res.status(400).send("Bad Request")
    }

    // Ler issues abertas e com a tag "verificada"
    let response
    try {
        response = await axios({
            url: `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${number}`,
            method: 'GET',
            headers: { 'Accept': 'application/vnd.github.v3+json', 'Authorization': `token ${GITHUB_OAUTH_TOKEN}` }
        })
    } catch (e) {
        return res.status(e.response.status).send({
            error: {
                status: e.response.status,
                title: e.response.statusText,
                data: e.response.data
            }
        })
    }

    const issue = response.data

    // Retornar jobs
    res.send({
        number: issue.number,
        title: issue.title,
        body: issue.body,
        created_at: issue.created_at,
        updated_at: issue.updated_at
    })
})

// Criar job
router.post('/', async (req, res) => {
    const { client_id, client_secret } = req.headers
    if (client_id !== APP_CLIENT_ID || client_secret !== APP_CLIENT_SECRET) {
        return res.status(403).send("Unauthorized")
    }

    // Criar issue
    const { title, body, labels } = req.body

    let response
    try {
        response = await axios({
            url: `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues`,
            method: 'POST',
            headers: { 'Accept': 'application/vnd.github.v3+json', 'Authorization': `token ${GITHUB_OAUTH_TOKEN}` },
            data: {
                title: title,
                body: body,
                labels: labels
            }
        })
    } catch (e) {
        return res.status(e.response.status).send({
            error: {
                status: e.response.status,
                title: e.response.statusText,
                data: e.response.data
            }
        })
    }

    const issue = response.data

    // Retornar jobs
    res.send({
        number: issue.number,
        title: issue.title,
        body: issue.body,
        created_at: issue.created_at,
        updated_at: issue.updated_at
    })
})

// Atualizar job
router.patch('/:number', async (req, res) => {
    const { client_id, client_secret } = req.headers
    if (client_id !== APP_CLIENT_ID || client_secret !== APP_CLIENT_SECRET) {
        return res.status(403).send("Unauthorized")
    }

    const { number } = req.params
    if (! number) {
        return res.status(400).send("Bad Request")
    }

    // Atualizar issue
    const { title, body, labels } = req.body

    let response
    try {
        response = await axios({
            url: `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${number}`,
            method: 'PATCH',
            headers: { 'Accept': 'application/vnd.github.v3+json', 'Authorization': `token ${GITHUB_OAUTH_TOKEN}` },
            data: {
                title: title,
                body: body,
                labels: labels
            }
        })
    } catch (e) {
        return res.status(e.response.status).send({
            error: {
                status: e.response.status,
                title: e.response.statusText,
                data: e.response.data
            }
        })
    }

    const issue = response.data

    // Retornar jobs
    res.send({
        number: issue.number,
        title: issue.title,
        body: issue.body,
        created_at: issue.created_at,
        updated_at: issue.updated_at
    })
})

// Encerrar/reabrir job
router.patch('/:number/:state', async (req, res) => {
    const { client_id, client_secret } = req.headers
    if (client_id !== APP_CLIENT_ID || client_secret !== APP_CLIENT_SECRET) {
        return res.status(403).send("Unauthorized")
    }

    const { number, state } = req.params
    if (! number || (state !== "open" && state !== "closed")) {
        return res.status(400).send("Bad Request")
    }

    // Encerrar issue
    let response
    try {
        response = await axios({
            url: `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${number}`,
            method: 'PATCH',
            headers: { 'Accept': 'application/vnd.github.v3+json', 'Authorization': `token ${GITHUB_OAUTH_TOKEN}` },
            data: {
                state: state
            }
        })
    } catch (e) {
        return res.status(e.response.status).send({
            error: {
                status: e.response.status,
                title: e.response.statusText,
                data: e.response.data
            }
        })
    }

    // Retornar jobs
    res.status(204).send("No Content")
})

module.exports = router
