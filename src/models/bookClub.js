/**
 * Mongoose model User.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The club needs to have a name.'],
    lowercase: true,
    trim: true
  },
  members: {
    type: Array,
    required: true
  },
  booksRead: {
    type: Array
  },
  booksSaved: {
    type: Array
  }
}, {
  versionKey: false
})

export const BookClub = mongoose.model('BookClub', schema)
