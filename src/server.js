/**
 * The starting point of the application.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import { connectDB } from './config/mongoose.js'
import { router } from './routes/router.js'
import cookieParser from 'cookie-parser'

/**
 * The main function of the application.
 */
export const main = async () => {
  await connectDB()

  const app = express()

  app.use(helmet())

  app.use(logger('dev'))

  app.use(cors({
    origin: ['http://localhost:3000', 'https://bookclubbin.herokuapp.com'],
    credentials: true
  }))

  app.use(cookieParser())

  // Parse requests of the content type application/json.
  app.use(express.json({ limit: '500kb' }))

  app.use(express.urlencoded({ extended: false }))

  // Register routes.
  app.use('/', router)

  // Error handling.
  app.use(function (err, req, res, next) {
    err.status = err.status || 500

    if (req.app.get('env') !== 'development') {
      res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })
      return
    }

    // Details only provided in development.
    return res
      .status(err.status)
      .json({
        status: err.status,
        message: err.message,
        innerException: err.innerException,
        stack: err.stack
      })
  })

  const port = process.env.PORT

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
    console.log('Press Ctrl + C to terminate...')
  })
}

main().catch(console.error)
