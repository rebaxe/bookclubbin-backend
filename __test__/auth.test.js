/* eslint-disable no-undef */
import request from 'supertest'
import { app } from './server.js'

describe('GET /api/v1/auth/google/auth', () => {
  it('should return 403', async () => {
    const res = await request(app).get('/api/v1/auth/google/auth')
    expect(res.status).toBe(403)
  })
})

describe('POST /api/v1/auth/google', () => {
  it('should return 403', async () => {
    const res = await request(app).post('/api/v1/auth/google')
    expect(res.status).toBe(403)
  })
})
