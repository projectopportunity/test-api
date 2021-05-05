const express = require('express')
const { ulid } = require('ulid')

const sanitize = require('@api/utils/sanitize')
const datastore = require('@api/datastore')()

datastore.init('sqlite::memory:')
  .then(() => {
    const server = express()
    server.use(express.json())

    /**
     * BEGINNING OF MIDDLEWARE
     * log incoming request
     */
    server.use((req, res, next) => {
      req.timestamp = Date.now()
      req.id = ulid()
      console.log(
        '-> %s %s %s %s %j',
        req.id,
        req.method,
        req.originalUrl,
        req.ip,
        sanitize(req.body)
      )
      next()
    })

    /**
     * ROUTES
     *
     * USERS
     */
    server.post('/api/users', require('@api/routes/users'))

    server.post('/api/users/login', require('@api/routes/users/login'))

    /**
     * COURSES
     */

    /**
     * NOT FOUND
     */
    server.use((req, res, next) => {
      if (!req.route) {
        throw new Error('resource not found')
      }
      next()
    })

    /**
     * GLOBAL ERROR HANDLER
     */
    server.use((err, req, res, next) => {
      console.error('  ', req.id, err)

      if (err.message === 'resource not found') {
        res.status(404)
      } else if (err.message === 'invalid login') {
        res.status(401)
      } else if (
        Array.isArray(err.validationErrorMessages) &&
        err.validationErrorMessages.length > 0
      ) {
        res.status(400).json({
          errors: err.validationErrorMessages
        })
      } else {
        res.status(500)
      }

      next()
    })

    /**
     * END OF MIDDLEWARE
     * log outgoing response
     */
    server.use((req, res) => {
      const duration = Date.now() - req.timestamp
      console.log('<-', req.id, res.statusCode, `${duration}ms`)
      res.end()
    })

    /**
     * The local port that the HTTP server will be listening on.
     * @type {Number}
     */
    const PORT = process.env.PORT || 3000

    /**
     * If any errors occur, end the process immediately.
     */
    server.once('error', (err) => {
      console.error(err)
      process.exit(1)
    })

    /**
     * Start the machine!
     */
    server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
