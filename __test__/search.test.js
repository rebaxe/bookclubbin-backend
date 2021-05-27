/* eslint-disable no-undef */
import request from 'supertest'
import { app } from './server.js'

describe('GET /api/v1/search/', () => {
  it('should return 400', async () => {
    const res = await request(app).get('/api/v1/search/')
    expect(res.status).toBe(400)
  })
})
