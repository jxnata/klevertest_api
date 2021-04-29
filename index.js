require('dotenv/config')
const express = require('express')
const cors = require('cors')
const axios = require('axios').default
const app = express()

app.use(cors())
app.use(express.json())

app.get('/balance/:btc', async (req, res) => {
    try {
        const result = await axios.get(`https://blockbook-bitcoin.tronwallet.me/api/v2/utxo/${req.params.btc}`)

        if (!result.error) {

            const confirmedArray = result.data.filter(i => i.confirmations >= 2).map(i => parseInt(i.value))
            const unconfirmedArray = result.data.filter(i => i.confirmations < 2).map(i => parseInt(i.value))

            const confirmed = confirmedArray.reduce((a, b) => a + b, 0)
            const unconfirmed = unconfirmedArray.reduce((a, b) => a + b, 0)

            return res.status(200).send({ confirmed, unconfirmed })
        }

        return res.status(400).send('Server error.')
    } catch (error) {
        if (error.response.data) {
            return res.status(400).send(error.response.data)
        }
        return res.status(400).send('Server error.')
    }
})

app.get('/health', async (req, res) => {
    try {
        const result = await axios.get(`https://blockbook-bitcoin.tronwallet.me/api/v2`)

        if (!result.error) {
            return res.status(200).send({ status: 'ok' })
        }
        return res.status(400).send({ status: 'error' })
    } catch (error) {
        return res.status(400).send({ status: 'error' })
    }
})

module.exports = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})