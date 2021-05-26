/**
 * The authentication routes.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { AuthController } from '../../../controllers/api/auth-controller.js'

const controller = new AuthController()

export const router = express.Router()

router.post('/google', (req, res, next) => controller.verifyLogin(req, res, next))

router.get('/google/auth', (req, res, next) => controller.verifyLoggedIn(req, res, next))

router.get('/google/logout', (req, res, next) => controller.logout(req, res, next))

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
