/**
 * API version 1 routes.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as searchRouter } from './search-router.js'
import { router as bookclubRouter } from './bookclub-router.js'
import { router as authRouter } from './auth-router.js'
import { router as userRouter } from './user-router.js'

export const router = express.Router()

router.use('/search/', searchRouter)

router.use('/bookclubs/', bookclubRouter)

router.use('/auth', authRouter)

router.use('/users', userRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
