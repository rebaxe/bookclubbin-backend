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

router.get('/', (req, res, next) => controller.find(req, res, next))

router.post('/register', (req, res, next) => controller.create(req, res, next))
