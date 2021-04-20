/**
 * API version 1 search routes.
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

router.get('/', (req, res, next) => controller.getSearchResult(req, res, next))
