const express = require('express')
const { ulid } = require('ulid')

const server = express()

server.use(express.json())

server.use((req, res, next) => {
  req.id = res.id = ulid()
  console.log(
    '-> %s %s %s %s %j',
    req.id,
    req.method,
    req.originalUrl,
    req.ip,
    req.body
  )
  next()
})

server.post('/api/users', require('@api/routes/users'))

server.use((err, req, res, next) => {
  console.error('  ', res.id, err)

  if (
    Array.isArray(err.validationErrorMessages) &&
    err.validationErrorMessages.length > 0
  ) {
    res.status(400).json({
      errors: err.validationErrorMessages
    })
  }
  next()
})

server.use((req, res) => {
  console.log('<-', res.id, res.statusCode)
  res.end()
})

const PORT = process.env.PORT || 3000

server.once('error', (err) => {
  console.error(err)
  process.exit(1)
})

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
