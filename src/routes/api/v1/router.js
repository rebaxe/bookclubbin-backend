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

export const router = express.Router()

router.use('/search/', searchRouter)

router.use('/bookclubs/', bookclubRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
