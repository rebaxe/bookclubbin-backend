/* eslint-disable no-undef */
import request from 'supertest'
import { app } from './server.js'

describe('GET /api/v1/search/', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/api/v1/search/').query({
      query: 'crawdads+intitle:crawdads'
    })
    expect(res.status).toBe(200)
    expect(res.body).toBeTruthy()
  })
  it('should return 204', async () => {
    const res = await request(app).get('/api/v1/search/').query({
      query: 'crawdadsss+intitle:crawdadsss'
    })
    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
  })
  it('should return 400', async () => {
    const res = await request(app).get('/api/v1/search/')
    expect(res.status).toBe(400)
  })
})
