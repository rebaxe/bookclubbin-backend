/**
 * Module for the AuthController.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */
import createError from 'http-errors'
import { User } from '../../models/user.js'
import { OAuth2Client } from 'google-auth-library'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

/**
 * Encapsulates a controller.
 */
export class AuthController {
  /**
   * Verifies the token on login.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async verifyLogin (req, res, next) {
    try {
      // Get token from request.
      const { token } = req.body

      // Verify the token.
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      })

      // Get data from payload.
      const { name, email, picture } = ticket.getPayload()

      // Look for user in DB.
      const currentUser = await User.findOne({ email: email })

      // If user not found in DB - create new user in DB.
      if (!currentUser) {
        const user = await new User({
          username: name,
          email: email,
          image: picture
        }).save()
        res
          .status(201)
          .cookie('accessToken', token, {
            httpOnly: true,
            secure: true
          })
          .json(user)
      } else {
        res
          .status(200)
          .cookie('accessToken', token, {
            httpOnly: true,
            secure: true
          })
          .json(currentUser)
      }
    } catch (error) {
      let e = error
      e = createError(403)
      e.innerException = error
      next(e)
    }
  }

  /**
   * Verifies the token to see if user is logged in.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async verifyLoggedIn (req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')

      const ticket = await client.verifyIdToken({
        idToken: token[1],
        audience: process.env.GOOGLE_CLIENT_ID
      })
      // Get data from payload.
      const { email } = ticket.getPayload()

      // Look for user in DB.
      const user = await User.findOne({ email: email })

      res.status(200).json(user)
    } catch (error) {
      next(createError(403))
    }
  }

  /**
   * Middleware that verifies the token.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async verifyToken (req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')

      const ticket = await client.verifyIdToken({
        idToken: token[1],
        audience: process.env.GOOGLE_CLIENT_ID
      })

      // Get data from payload.
      const { email } = ticket.getPayload()

      // Look for user in DB.
      const user = await User.findOne({ email: email })

      // Populate req-object with user id.
      req.user = user.id

      next()
    } catch (error) {
      next(createError(403))
    }
  }
}
