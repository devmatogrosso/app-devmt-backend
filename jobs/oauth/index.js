/*
    GitHub OAuth Authentication
*/
const axios = require('axios').default
const express = require('express')
const router = express.Router()

const {
    GITHUB_OAUTH_CLIENT_ID
} = process.env

// Access token
router.get('/access_token', async (req, res) => {
    const { code } = req.query
    if (! code) {
        res.redirect(`https://github.com/login/oauth/authorize?client_id=${GITHUB_OAUTH_CLIENT_ID}&scope=repo`)
        return
    }

    // Authenticate with GitHub
    const response = await axios({
        url: 'https://github.com/login/oauth/access_token',
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        data: {
            client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
            client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
            code: code
        }
    })

    res.send(response.data)
})

module.exports = router
