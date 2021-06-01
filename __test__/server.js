/**
 * The starting point of the application.
 *
 * @author David Heinebäck <du222aa@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// import helmet from 'helmet'
import { router } from '../src/routes/router.js'

dotenv.config()

/**
 * The main function of the application.
 */

export const app = express()

// Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
// app.use(helmet())

app.use(cors())

// Parse requests of the content type application/json.
app.use(express.json({ limit: '500kb' }))

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

// Starts the HTTP server listening for connections.
app.listen(process.env.PORT_TEST)
