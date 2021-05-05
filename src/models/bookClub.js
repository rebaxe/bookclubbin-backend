/**
 * Mongoose model User.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  clubname: {
    type: String,
    required: [true, 'The club needs to have a name.'],
    lowercase: true,
    trim: true
  },
  firstMember: {
    type: String,
    required: true
  },
  invitedMembers: {
    type: Array,
    required: true
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
  versionKey: false,
  toJSON: {
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret._id
      delete ret.email
    },
    virtuals: true // ensure virtual fields are serialized
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

export const BookClub = mongoose.model('BookClub', schema)
