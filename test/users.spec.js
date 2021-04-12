/* eslint-env mocha */
const { expect } = require('chai')
const axios = require('axios')

describe('users route', () => {
  context('when user is created', () => {
    describe('the response', () => {
      let res

      before(() => {
        const data = {
          firstName: 'test',
          lastName: 'test',
          emailAddress: 'test@example.com',
          password: 'test'
        }
        return axios.post('http://localhost:3000/users', data, { validateStatus: false })
          .then((response) => {
            res = response})
      })

      it('must have correct status code', () => {
        const expected = 201
        const actual = res.status
        expect(actual).to.equal(expected)
      })
    })
  })
})
