/**
 * Module for the AuthController.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */
import createError from 'http-errors'
import { User } from '../../models/user.js'

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Search for user by partial name.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async searchUser (req, res, next) {
    try {
      const searchString = req.query.searchString
      const result = await User.find({ username: { $regex: searchString, $options: 'i' } })
      res.status(200).json(result)
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Get user by ID.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUser (req, res, next) {
    try {
      const userId = req.params.id
      const user = await User.findById(userId)
      res.status(200).json({ username: user.username, image: user.image, id: user._id })
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Delete a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteUser (req, res, next) {
    try {
      const userId = req.params.id
      await User.findByIdAndDelete(userId)
      res.sendStatus(204)
    } catch (error) {
      let e = error
      e = createError(404)
      e.innerException = error
      next(e)
    }
  }
}
