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
  it('should return 201 and bookclub on successful creation of a bookclub', async () => {
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
  it('should return 400 when creation was unsuccesful', async () => {
    const res = await request(app).post('/api/v1/bookclubs/register').send({})
    expect(res.status).toBe(400)
  })
})

describe('GET /api/v1/bookclubs/:id', () => {
  it('should return 403 when user is unauthorized to this bookclub', async () => {
    const res = await request(app).get('/api/v1/bookclubs/123')
    expect(res.status).toBe(403)
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
  it('should return 204 if user is not member in any bookclubs', async () => {
    const res = await request(app).get(`/api/v1/bookclubs/user/${users[1].id}`)
    expect(res.status).toBe(204)
  })
})

describe('GET /api/v1/bookclubs/user/:id/invites', () => {
  it('should return 200 and the club(s) the user is invited to', async () => {
    const res = await request(app).get(`/api/v1/bookclubs/user/${users[2].id}/invites`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].clubname).toEqual('klubben')
  })
  it('should return 204 if the user has no invites', async () => {
    const res = await request(app).get(`/api/v1/bookclubs/user/${users[3].id}/invites`)
    expect(res.status).toBe(204)
  })
})

describe('PATCH /api/v1/bookclubs/:id/members/invite', () => {
  it('should return 204 on succesful invite', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite`).send({
      invite: {
        invitingUser: users[1].id, invitedUser: users[3].id
      }
    })
    expect(res.status).toBe(204)
  })
  it('should return 400 if request body is incorrect', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite`).send({
      invite: {
        invitingUser: users[1].id
      }
    })
    expect(res.status).toBe(400)
  })
  it('should return 400 if request body is incorrect', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite`)
    expect(res.status).toBe(400)
  })
  it('should return 400 if request body is incorrect', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite`).send({ invite: {} })
    expect(res.status).toBe(400)
  })
  it('should return 400 if request body is incorrect', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite`).send({
      invite: {
        invitedUser: users[1].id
      }
    })
    expect(res.status).toBe(400)
  })
  it('should return 404 if bookclub not exists', async () => {
    const res = await request(app).patch('/api/v1/bookclubs/123/members/invite').send({
      invite: {
        invitingUser: users[1].id, invitedUser: users[3].id
      }
    })
    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/v1/bookclubs/:id/members/invite/accept', () => {
  it('should return 204 on successful accept of invite', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite/accept`).send({
      user: users[1].id
    })
    expect(res.status).toBe(204)
  })
  it('should return 400 if request body is incorrect', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite/accept`)
    expect(res.status).toBe(400)
  })
  it('should return 404 if bookclub not exists', async () => {
    const res = await request(app).patch('/api/v1/bookclubs/123/members/invite/accept').send({
      user: users[1].id
    })
    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/v1/bookclubs/:id/members/invite/remove', () => {
  it('should return 204 on succesful rejection of invite', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite/remove`).send({
      user: users[2].id
    })
    expect(res.status).toBe(204)
  })
  it('should return 400 if request body is incorrect', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/invite/remove`)
    expect(res.status).toBe(400)
  })
  it('should return 404 if bookclub not exists', async () => {
    const res = await request(app).patch('/api/v1/bookclubs/123/members/invite/remove').send({
      user: users[2].id
    })
    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/v1/bookclubs/:id/books/add', () => {
  it('should return 204 on succesful update of books', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/books/add`).send({
      bookSaved: 'A book title'
    })
    expect(res.status).toBe(204)
  })
  it('should return 204 on succesful update of books', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/books/add`).send({
      bookRead: 'Another book title'
    })
    expect(res.status).toBe(204)
  })
  it('should return 404 if bookclub not exists', async () => {
    const res = await request(app).patch('/api/v1/bookclubs/123/books/add').send({
      bookRead: 'A book title'
    })
    expect(res.status).toBe(404)
  })
  it('should return 400 if request body is incorrect', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/books/add`).send({
      book: 'A book title'
    })
    expect(res.status).toBe(400)
  })
})

describe('PATCH /api/v1/bookclubs/:id/books/remove', () => {
  it('should return 204 on succesful update of books', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/books/remove`).send({
      bookSaved: 'A book title'
    })
    expect(res.status).toBe(204)
  })
  it('should return 204 on succesful update of books', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/books/remove`).send({
      bookRead: 'Another book title'
    })
    expect(res.status).toBe(204)
  })
  it('should return 404 if bookclub not exists', async () => {
    const res = await request(app).patch('/api/v1/bookclubs/123/books/remove').send({
      bookRead: 'A book title'
    })
    expect(res.status).toBe(404)
  })
  it('should return 400 if request body is incorrect', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/books/remove`).send({
      book: 'A book title'
    })
    expect(res.status).toBe(400)
  })
})

describe('PATCH /api/v1/bookclubs/:id/members/remove', () => {
  it('should return 204 and one bookclub in db on successful update', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/remove`).send({
      member: users[1].id
    })
    expect(res.status).toBe(204)
    const clubs = await BookClub.find({})
    expect(clubs).toHaveLength(1)
  })
  it('should return 400 if request body is incorrect', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/remove`)
    expect(res.status).toBe(400)
  })
  it('should return 404 if bookclub not exists', async () => {
    const res = await request(app).patch('/api/v1/bookclubs/123/members/remove').send({
      member: users[3].id
    })
    expect(res.status).toBe(404)
  })
  it('should return 204 if no bookclubs were found', async () => {
    const res = await request(app).patch(`/api/v1/bookclubs/${clubId}/members/remove`).send({
      member: users[0].id
    })
    expect(res.status).toBe(204)
    const clubs = await BookClub.find({})
    expect(clubs).toHaveLength(0)
  })
})

describe('POST /api/v1/bookclubs/:id/delete', () => {
  it('should return 404 if bookclub not exists', async () => {
    const res = await request(app).post('/api/v1/bookclubs/123/delete')
    expect(res.status).toBe(404)
  })
  it('should return 204 and no clubs in db on succesful delete of club', async () => {
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
    const clubs = await BookClub.find({})
    expect(clubs).toHaveLength(0)
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
