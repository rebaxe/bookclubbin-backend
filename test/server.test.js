import chai from 'chai'
import chaiHttp from 'chai-http'
import mocha from 'mocha'
import { main as server } from '../src/server.js'

chai.use(chaiHttp)

chai.should()

mocha.describe('Sample Test', () => {
  mocha.it('should test that true === true', () => {
    chai.assert.equal(true, true)
  })
})

mocha.describe('GET /api/v1/search/', () => {
  mocha.it('should return 400 and error message', (done) => {
    chai.request(server)
      .get('/api/v1/search/')
      .end((res) => {
        res.should.have.status(400)
        res.should.have.message('The required parameter \'query\' is missing or empty.')
      })
    done()
  })
})
