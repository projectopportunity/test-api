/* eslint-env mocha */
const axios = require ('axios')

describe ('users route', () => {
  context ("when user is created", () =>{
    describe ('the response', () => {
      before(() => {
        return axios.post('http://localhost:3000/users')
      })
      it ('must have correct status code', () => {
        const expected = 201

      })

    })
  })
}) 

