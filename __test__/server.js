/**
 * The starting point of the application when testing with Jest.
 *
 * @author Rebecca Axelsson <ra223ai@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import { router } from '../src/routes/router.js'

// Env-variables.
dotenv.config()

/**
 * The main function of the application.
 */

export const app = express()

app.use(helmet())

app.use(cors())

app.use(express.json({ limit: '500kb' }))

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

  // These details are only provided in development!
  return res
    .status(err.status)
    .json({
      status: err.status,
      message: err.message,
      innerException: err.innerException,
      stack: err.stack
    })
})

// Starts the HTTP server listening for connections.
app.listen(process.env.PORT_TEST)
