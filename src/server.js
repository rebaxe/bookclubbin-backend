/**
 * The starting point of the application.
 *
 * @author Rebecca Axelsson
 * @version 1.0.0
 */

import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import { connectDB } from './config/mongoose.js'
import { router } from './routes/router.js'

/**
 * The main function of the application.
 */
const main = async () => {
  await connectDB()

  const app = express()

  app.use(logger('dev'))

  app.use(cors())

  // Parse requests of the content type application/json.
  app.use(express.json({ limit: '500kb' }))

  app.use(express.urlencoded())

  // Register routes.
  app.use('/', router)

  // Error handler.
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

    // Development only!
    // Only providing detailed error in development.
    return res
      .status(err.status)
      .json({
        status: err.status,
        message: err.message,
        innerException: err.innerException,
        stack: err.stack
      })
  })

  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl + C to terminate...')
  })
}

main().catch(console.error)
