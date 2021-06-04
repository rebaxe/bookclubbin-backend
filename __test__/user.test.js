/* eslint-disable no-undef */
import mongoose from 'mongoose'
import { User } from '../src/models/user.js'
import { BookClub } from '../src/models/bookClub.js'
import { mockData } from './mockdata.js'
import dotenv from 'dotenv'
import request from 'supertest'
import { app } from './server.js'

dotenv.config()

// Connect to test database
beforeAll(async () => {
  const url = process.env.DB_CONNECTION_STRING_TEST
  await mongoose.connect(url, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  await User.insertMany(mockData.users)
  const users = await User.find({})
  await BookClub.create({
    clubname: 'Klubben',
    invitations: [
      { invitingUser: users[0].id, invitedUser: users[1].id },
      { invitingUser: users[0].id, invitedUser: users[2].id }
    ],
    members: [users[0].id],
    booksRead: [],
    booksSaved: []
  })
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
  it('should return 200 and two users', async () => {
    const res = await request(app).get('/api/v1/users/').query({ searchString: 'Pe' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })
  it('should return 200 and empty array if no users found', async () => {
    const res = await request(app).get('/api/v1/users/').query({ searchString: 'Qxz' })
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('GET /api/v1/user/:id', () => {
  it('should return 200 and requested user with correct id', async () => {
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
  it('should return 404 if user not exists', async () => {
    const res = await request(app).get('/api/v1/users/123')
    expect(res.status).toBe(404)
  })
})

describe('POST /api/v1/user/:id/delete', () => {
  it('should return 204 on successful delete of requested user with correct id', async () => {
    const res = await request(app).post(`/api/v1/users/${userId}/delete`)
    expect(res.status).toBe(204)
    const users = await User.find({})
    expect(users).toHaveLength(3)
  })
  it('should return 404 if user not exists', async () => {
    const res = await request(app).post('/api/v1/users/123/delete')
    expect(res.status).toBe(404)
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
