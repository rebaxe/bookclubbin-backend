/**
 * API version 1 bookclub routes.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { BookclubController } from '../../../controllers/api/bookclub-controller.js'
import { AuthController } from '../../../controllers/api/auth-controller.js'

const auth = new AuthController()

const controller = new BookclubController()

export const router = express.Router()

router.get('/:id', auth.verifyToken, (req, res, next) => controller.get(req, res, next))

router.get('/user/:id', (req, res, next) => controller.find(req, res, next))

router.get('/user/:id/invites', (req, res, next) => controller.getInvites(req, res, next))

router.patch('/:id/members/invite/accept', (req, res, next) => controller.acceptInvite(req, res, next))

router.post('/register', (req, res, next) => controller.create(req, res, next))

router.patch('/:id/books/add', (req, res, next) => controller.addBook(req, res, next))

router.patch('/:id/books/remove', (req, res, next) => controller.removeBook(req, res, next))

router.patch('/:id/members/invite', (req, res, next) => controller.inviteMember(req, res, next))

router.patch('/:id/members/remove', (req, res, next) => controller.removeMember(req, res, next))

router.patch('/:id/members/invite/remove', (req, res, next) => controller.removeInvite(req, res, next))

router.post('/:id/delete', (req, res, next) => controller.delete(req, res, next))

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
