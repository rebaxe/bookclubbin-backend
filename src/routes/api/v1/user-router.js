/**
 * The user routes.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { UserController } from '../../../controllers/api/user-controller.js'
import { BookclubController } from '../../../controllers/api/bookclub-controller.js'

const controller = new UserController()
const bookclubController = new BookclubController()

export const router = express.Router()

router.get('/', (req, res, next) => controller.searchUser(req, res, next))

router.get('/:id', (req, res, next) => controller.getUser(req, res, next))

router.post('/:id/delete',
  (req, res, next) => bookclubController.deleteUser(req, res, next),
  (req, res, next) => controller.deleteUser(req, res, next))

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
