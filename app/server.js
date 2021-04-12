const express = require('express')

const server = express()

server.use(express.json())
server.post('/api/users', require('@api/routes/users'))

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
