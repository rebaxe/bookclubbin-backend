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
        name: req.body.name,
        members: req.body.members,
        booksRead: req.body.booksRead,
        booksSaved: req.body.booksSaved
      })
      console.log(club)
      res.status(201).json(club)
    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * Provide req.image to route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    try {
      const email = req.query.email
      console.log(email)
      const club = await BookClub.findOne({ 'members.email': email })
      res.status(200).json(club)
    } catch (error) {
      console.log(error.message)
    }
  }
}
