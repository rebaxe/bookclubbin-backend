import request from 'supertest'
import { app } from './server.js'

// Connects to database called test
// beforeAll(async () => {
//   const url = process.env.DB_CONNECTION_STRING_TEST
//   await mongoose.connect(url, { useNewUrlParser: true })
// })

describe('GET /api/v1/search/', () => {
  it('should return 400', async () => {
    const res = await request(app).get('/api/v1/search/')
    expect(res.status).toBe(400)
  })
})
