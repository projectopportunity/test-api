const express = require('express')

const server = express()

server.use(express.json())
server.use((req, res, next) => {
  console.log('-> %s %s %s %j', req.method, req.originalUrl, req.ip, req.body)
  next()
})

server.post('/api/users', require('@api/routes/users'))

server.use((err, req, res, next) => {
  console.error(err)
})

server.use((req, res) => {
  console.log('<-', res.statusCode)
})


const PORT = process.env.PORT || 3000

server.once('error', (err) => {
  console.error(err)
  process.exit(1)
})

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
