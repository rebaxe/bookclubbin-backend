import mongoose from 'mongoose'
import { User } from '../src/models/user.js'
import { mockData } from './mockdata.js'
import dotenv from 'dotenv'
import request from 'supertest'
import { app } from './server.js'

dotenv.config()

// Connect to test database
beforeAll(async () => {
  const url = process.env.DB_CONNECTION_STRING_TEST
  console.log(url)
  await mongoose.connect(url, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  await User.insertMany(mockData.users)
})

// Variable to be used in tests.
let userId = ''

describe('GET /api/v1/users/', () => {
  it('should return 200 and one user with correct user data', async () => {
    const res = await request(app).get('/api/v1/users/').query({ searchString: 'Greta' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: 'Greta Andersson',
          image: 'https://randomuser.me/api/portraits/women/52.jpg'
        })
      ])
    )
    userId = res.body[0].id
  })
})

describe('GET /api/v1/users/', () => {
  it('should return 200 and two users', async () => {
    const res = await request(app).get('/api/v1/users/').query({ searchString: 'Pe' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })
})

describe('GET /api/v1/user/:id', () => {
  it('should return requested user with correct id', async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual(
      {
        id: userId,
        username: 'Greta Andersson',
        image: 'https://randomuser.me/api/portraits/women/52.jpg'
      }
    )
  })
})

describe('POST /api/v1/user/:id/delete', () => {
  it('should delete requested user with correct id', async () => {
    const res = await request(app).post(`/api/v1/users/${userId}/delete`)
    expect(res.status).toBe(204)
    const users = await User.find({})
    expect(users).toHaveLength(3)
  })
})

/**
 * Clear the db.
 */
async function removeAllCollections () {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany()
  }
}

afterAll(async () => {
  await removeAllCollections()
  await mongoose.connection.close()
})
