/**
 * API version 1 bookclub routes.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { BookclubController } from '../../../controllers/api/bookclub-controller.js'

const controller = new BookclubController()

export const router = express.Router()

router.get('/user/:id', (req, res, next) => controller.find(req, res, next))

router.get('/invite', (req, res, next) => controller.getInvite(req, res, next))

router.patch('/accept', (req, res, next) => controller.acceptInvite(req, res, next))

router.post('/register', (req, res, next) => controller.create(req, res, next))

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
