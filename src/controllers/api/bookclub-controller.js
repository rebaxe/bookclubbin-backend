/**
 * Module for the BookclubController.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import { BookClub } from '../../models/bookClub.js'
import createError from 'http-errors'

/**
 * Encapsulates an image controller.
 */
export class BookclubController {
  /**
   * Register a new book club.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const club = await BookClub.create({
        clubname: req.body.clubname,
        invitations: req.body.invitations,
        members: req.body.members,
        booksRead: [],
        booksSaved: []
      })
      res.status(201).json(club)
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Get a bookclub by id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async get (req, res, next) {
    try {
      const id = req.params.id
      const club = await BookClub.findById(id)
      !club ? res.status(204) : res.status(200).json(club)
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Find book club where user is member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    try {
      const id = req.params.id
      const club = await BookClub.find({ members: id })
      !club ? res.status(204) : res.status(200).json(club)
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Get the users invite(s).
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getInvites (req, res, next) {
    try {
      const userId = req.params.id
      const invitedToClub = await BookClub.find({ 'invitations.invitedUser': userId })

      if (invitedToClub.length === 0) {
        res.sendStatus(204)
      } else {
        res.status(200).json(invitedToClub)
      }
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Send an invitation.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async inviteMember (req, res, next) {
    try {
      const clubId = req.params.id
      const invite = req.body.invite
      await BookClub.findByIdAndUpdate(clubId,
        {
          $push: { invitations: invite }
        }
      )
      res.sendStatus(204)
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Accept an invitation.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async acceptInvite (req, res, next) {
    try {
      const clubId = req.params.id
      const userId = req.body.user

      await BookClub.findOneAndUpdate(
        { _id: clubId, 'invitations.invitedUser': userId },
        {
          $pull: {
            invitations: {
              invitedUser: userId
            }
          },
          $push: { members: userId }
        }
      )
      res.sendStatus(204)
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Remove an invite.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async removeInvite (req, res, next) {
    try {
      const clubId = req.params.id
      const userId = req.body.user

      const club = await BookClub.findOneAndUpdate(
        { _id: clubId, 'invitations.invitedUser': userId },
        {
          $pull: {
            invitations: {
              invitedUser: userId
            }
          }
        }
      )
      res.sendStatus(204)
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Add book to bookclub.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addBook (req, res, next) {
    try {
      const clubId = req.params.id
      if (req.body.bookSaved) {
        await BookClub.findOneAndUpdate(
          { _id: clubId },
          {
            $addToSet: { booksSaved: req.body.bookSaved }
          }
        )
        res.sendStatus(204)
      } else if (req.body.bookRead) {
        await BookClub.findOneAndUpdate(
          { _id: clubId },
          {
            $addToSet: { booksRead: req.body.bookRead }
          }
        )
        res.sendStatus(204)
      }
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Remove book from bookclub.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async removeBook (req, res, next) {
    try {
      const clubId = req.params.id
      if (req.body.bookSaved) {
        await BookClub.findOneAndUpdate(
          { _id: clubId },
          {
            $pull: { booksSaved: req.body.bookSaved }
          }
        )
        res.sendStatus(204)
      } else if (req.body.bookRead) {
        await BookClub.findOneAndUpdate(
          { _id: clubId },
          {
            $pull: { booksRead: req.body.bookRead }
          }
        )
        res.sendStatus(204)
      }
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Remove member from bookclub.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async removeMember (req, res, next) {
    try {
      const clubId = req.params.id
      await BookClub.findByIdAndUpdate(clubId,
        {
          $pull: { members: req.body.member }
        }
      )

      const club = await BookClub.findById(clubId)

      // If there are no members left in the club - delete it.
      if (club.members.length === 0) {
        await BookClub.findByIdAndDelete(clubId)
      }

      res.sendStatus(204)
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Delete a bookclub.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      const clubId = req.params.id
      await BookClub.findByIdAndDelete(clubId)
      res.sendStatus(204)
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Delete a user from members and invites.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteUser (req, res, next) {
    try {
      const userId = req.params.id
      await BookClub.findOneAndUpdate({ $or: [{ 'invitations.invitingUser': userId }, { 'invitations.invitedUser': userId }] },
        { $pull: { invitations: { invitingUser: userId, invitedUser: userId } } },
        { multi: true }
      )
      const clubs = await BookClub.find({ members: userId })
      clubs.forEach(async (club) => {
        await BookClub.findByIdAndUpdate(club.id, {
          $pull: { members: userId }
        })
        const updatedClub = await BookClub.findById(club.id)
        if (updatedClub.members.length === 0) {
          await BookClub.findByIdAndDelete(club.id)
        }
      })
      next()
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }
}
