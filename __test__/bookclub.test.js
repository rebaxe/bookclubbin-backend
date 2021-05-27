/* eslint-disable no-undef */
import mongoose from 'mongoose'
import { User } from '../src/models/user.js'
import { BookClub } from '../src/models/bookClub.js'
import { mockData } from './mockdata.js'
import dotenv from 'dotenv'
import request from 'supertest'
import { app } from './server.js'

dotenv.config()

// Variable to be used in tests.
let users = []
let clubId = ''

// Connect to test database
beforeAll(async () => {
  const url = process.env.DB_CONNECTION_STRING_TEST
  await mongoose.connect(url, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  await User.insertMany(mockData.users)
  users = await User.find({})
})

describe('POST /api/v1/bookclubs/register', () => {
  it('should return 201 and add bookclub to db', async () => {
    const res = await request(app).post('/api/v1/bookclubs/register').send({
      clubname: 'Klubben',
      invitations: [
        { invitingUser: users[0].id, invitedUser: users[1].id },
        { invitingUser: users[0].id, invitedUser: users[2].id }
      ],
      members: [users[0].id],
      booksRead: [],
      booksSaved: []
    })
    expect(res.status).toBe(201)
    const club = await BookClub.find({})
    expect(club).toHaveLength(1)
    clubId = res.body.id
  })
  it('should return 400', async () => {
    const res = await request(app).post('/api/v1/bookclubs/register').send({})
    expect(res.status).toBe(400)
  })
})

describe('GET /api/v1/bookclubs/user/:id', () => {
  it('should return 200 and an array with bookclubs where the user is a member', async () => {
    const res = await request(app).get(`/api/v1/bookclubs/user/${users[0].id}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          clubname: 'klubben'
        })
      ])
    )
  })
  it('should return 204', async () => {
    const res = await request(app).get(`/api/v1/bookclubs/user/${users[1].id}`)
    expect(res.status).toBe(204)
  })
})

describe('GET /api/v1/bookclubs/user/:id/invites', () => {
  it('should return 200 and the club the user is invited to', async () => {
    const res = await request(app).get(`/api/v1/bookclubs/user/${users[2].id}/invites`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].clubname).toEqual('klubben')
  })
  it('should return 204', async () => {
    const res = await request(app).get(`/api/v1/bookclubs/user/${users[3].id}/invites`)
    expect(res.status).toBe(204)
  })
})

describe('PATCH /api/v1/bookclubs/:id/members/invite', () => {
  it('should return 204', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite`).send({
      invite: {
        invitingUser: users[1].id, invitedUser: users[3].id
      }
    })
    expect(res.status).toBe(204)
  })
  it('should return 400', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite`).send({
      invite: {
        invitingUser: users[1].id
      }
    })
    expect(res.status).toBe(400)
  })
  it('should return 400', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite`)
    expect(res.status).toBe(400)
  })
  it('should return 400', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite`).send({ invite: {} })
    expect(res.status).toBe(400)
  })
  it('should return 400', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite`).send({
      invite: {
        invitedUser: users[1].id
      }
    })
    expect(res.status).toBe(400)
  })
  it('should return 404', async () => {
    const res = await request(app).patch('/api/v1/bookclubs/123/members/invite').send({
      invite: {
        invitingUser: users[1].id, invitedUser: users[3].id
      }
    })
    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/v1/bookclubs/:id/members/invite/accept', () => {
  it('should return 204', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite/accept`).send({
      user: users[1].id
    })
    expect(res.status).toBe(204)
  })
  it('should return 400', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite/accept`)
    expect(res.status).toBe(400)
  })
  it('should return 404', async () => {
    const res = await request(app).patch('/api/v1/bookclubs/123/members/invite/accept').send({
      user: users[1].id
    })
    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/v1/bookclubs/:id/members/invite/remove', () => {
  it('should return 204', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite/remove`).send({
      user: users[2].id
    })
    expect(res.status).toBe(204)
  })
  it('should return 400', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite/remove`)
    expect(res.status).toBe(400)
  })
  it('should return 404', async () => {
    const res = await request(app).patch('/api/v1/bookclubs/123/members/invite/remove').send({
      user: users[2].id
    })
    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/v1/bookclubs/:id/members/remove', () => {
  it('should return 204 and one bookclub in db', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/remove`).send({
      member: users[1].id
    })
    expect(res.status).toBe(204)
    const clubs = await BookClub.find({})
    expect(clubs).toHaveLength(1)
  })
  it('should return 400', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/remove`)
    expect(res.status).toBe(400)
  })
  it('should return 404', async () => {
    const res = await request(app).patch('/api/v1/bookclubs/123/members/remove').send({
      member: users[3].id
    })
    expect(res.status).toBe(404)
  })
  it('should return 204 and no bookclubs in db', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/remove`).send({
      member: users[0].id
    })
    expect(res.status).toBe(204)
    const clubs = await BookClub.find({})
    expect(clubs).toHaveLength(0)
  })
})

describe('POST /api/v1/bookclubs/:id/delete', () => {
  it('should return 404', async () => {
    const res = await request(app).post('/api/v1/bookclubs/123/delete')
    expect(res.status).toBe(404)
  })
  it('should return 204', async () => {
    const club = await BookClub.create({
      clubname: 'The club',
      invitations: [
        { invitingUser: users[0].id, invitedUser: users[1].id },
        { invitingUser: users[0].id, invitedUser: users[2].id }
      ],
      members: [users[0].id],
      booksRead: [],
      booksSaved: []
    })
    const res = await request(app).post(`/api/v1/bookclubs/${club.id}/delete`)
    expect(res.status).toBe(204)
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
