const test = require('tape')
const supertest = require('supertest')
const index = require('../index')

test('GET /balance', (t) => {
    supertest(index)
        .get('/balance/bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            t.error(err, 'No erros')
            t.assert(typeof res.body == 'object', "Get balance is correct")
            t.end()
        })
})