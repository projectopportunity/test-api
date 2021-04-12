/* eslint-env mocha */
const { expect } = require('chai')
const axios = require('axios')
const Procmonrest = require('procmonrest')
const path = require('path')

describe('users route', function () {
  this.timeout(7001) // ms teams ftw

  const serverProcess = new Procmonrest({
    waitFor: /listening/,
    saveLogTo: path.join(__dirname, 'users.log')
  })

  before(() => {
    return serverProcess.start()
  })
  after(() => {
    if (serverProcess.isRunning) {
      return serverProcess.stop()
    }
  })

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

        return axios.post('http://localhost:3000/api/users', data, { validateStatus: false })
          .then((response) => {
            res = response
          })
      })

      it('must have correct status code', () => {
        const expected = 201
        const actual = res.status
        expect(actual).to.equal(expected)
      })

      it('must be empty', () => {
        const expected = ''
        const actual = res.data
        expect(actual).to.equal(expected)
      })

      describe('the header', () => {
        it('must include location', () => {
          expect(res.headers).to.have.property('location')
        })
      })
    })
  })
})
