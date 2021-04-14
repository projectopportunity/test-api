const express = require('express')

const server = express()

server.use(express.json())
server.post('/api/users', require('@api/routes/users'))

server.use((err, req, res, next) => {
  console.error(err)
})

const PORT = process.env.PORT || 3000

server.once('error', (err) => {
  console.error(err)
  process.exit(1)
})

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
