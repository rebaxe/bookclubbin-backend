/**
 * API version 1 image routes.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import express from 'express'
// import createError from 'http-errors'
// import jwt from 'jsonwebtoken'
import { SearchController } from '../../../controllers/api/search-controller.js'

const controller = new SearchController()

export const router = express.Router()

/**
 * Authenticates requests.
 *
 * If successful authentication - populate `req.user` and allow the request to continue.
 * If authentication fails - send an unauthorized response.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
// const authenticateJWT = (req, res, next) => {
//   const authorization = req.headers.authorization?.split(' ')
//
//   if (authorization?.[0] !== 'Bearer') {
//     next(createError(401))
//     return
//   }
//   try {
//     const payload = jwt.verify(authorization[1], Buffer.from(process.env.ACCESS_TOKEN_PUBLIC, 'base64'))
//     req.user = {
//       email: payload.sub
//     }
//     next()
//   } catch (err) {
//     next(createError(403))
//   }
// }

router.get('/', /* authenticateJWT, */ (req, res, next) => controller.getSearchResult(req, res, next))

// router.post('/', /* authenticateJWT, */ (req, res, next) => controller.create(req, res, next))
