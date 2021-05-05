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
        firstMember: req.body.firstMember,
        invitedMembers: req.body.invitedMembers,
        members: req.body.members,
        booksRead: [],
        booksSaved: []
      })
      console.log(club)
      res.status(201).json(club)
    } catch (error) {
      console.log(error.message)
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
      const club = await BookClub.findOne({ members: id })
      console.log(club)
      !club ? res.status(404).json({ message: 'No bookclub found for this user.' }) : res.status(200).json(club)
      // res.status(200).json(club)
    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * Get the users invite.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getInvite (req, res, next) {
    try {
      const id = req.query.id
      const invitedToClub = await BookClub.findOne({ invitedMembers: id })
      !invitedToClub
        ? res.status(404).json({ message: 'No invites found for this user.' })
        : res.status(200).json({
          clubname: invitedToClub.clubname,
          firstMember: invitedToClub.firstMember,
          clubId: invitedToClub.id
        })
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
      const clubId = req.body.clubId
      const userId = req.body.userId
      const club = await BookClub.findOneAndUpdate(
        { _id: clubId, invitedMembers: userId },
        {
          $pull: { invitedMembers: userId },
          $push: { members: userId }
        }
      )
      console.log(clubId)
      console.log(userId)
      console.log(club)
      res.sendStatus(204)
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }
}
