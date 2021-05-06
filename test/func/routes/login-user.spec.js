/* eslint-env mocha */

const Procmonrest = require('procmonrest')
const path = require('path')

describe('users route', function () {
  this.timeout(global.ttl) // ms teams ftw

  const serverProcess = new Procmonrest({
    waitFor: /listening/,
    saveLogTo: path.join(__dirname, 'login-user.log')
  })

  before(() => {
    return serverProcess.start()
  })

  after(() => {
    if (serverProcess.isRunning) {
      return serverProcess.stop()
    }
  })

  context('when user logs in', () => {
    before(async () => {
      await postHttpRequest('users', {
        firstName: 'test first',
        lastName: 'test last',
        emailAddress: 'test@example.com',
        password: 'test'
      })
    })

    context('and the credentials are invalid', () => {
      describe('the response', () => {
        let res

        before(async () => {
          res = await postHttpRequest('users/login', {
            emailAddress: 'test@example.com',
            password: '12312343546'
          })
        })

        it('must have correct status code', () => {
          const expected = 401
          const actual = res.status
          expect(actual).to.equal(expected)
        })
      })
    })

    context('when both login credentials are missing', () => {
      describe('the response', () => {
        let res

        before(async () => {
          res = await postHttpRequest('users/login', {})
        })

        it('must have correct status code', () => {
          const expected = 400
          const actual = res.status
          expect(actual).to.equal(expected)
        })
      })
    })

    context('when the email login credential is missing', () => {
      describe('the response', () => {
        let res

        before(async () => {
          res = await postHttpRequest('users/login', {
            password: 'test'
          })
        })

        it('must have correct status code', () => {
          const expected = 400
          const actual = res.status
          expect(actual).to.equal(expected)
        })
      })
    })

    context('when the passowrd login credential is missing', () => {
      describe('the response', () => {
        let res

        before(async () => {
          res = await postHttpRequest('users/login', {
            emailAddress: 'test@example.com'
          })
        })

        it('must have correct status code', () => {
          const expected = 400
          const actual = res.status
          expect(actual).to.equal(expected)
        })
      })
    })

    context('and the credentials are valid', () => {
      describe('the response', () => {
        let res

        before(async () => {
          res = await postHttpRequest('users/login', {
            emailAddress: 'test@example.com',
            password: 'test'
          })
        })

        it('must have correct status code', () => {
          const expected = 200
          const actual = res.status
          expect(actual).to.equal(expected)
        })

        it('must have the correct content type', () => {
          const expected = /^application\/json/
          const actual = res.headers['content-type']
          expect(actual).to.match(expected)
        })

        it('must contain the correct data', () => {
          const expected = {
            firstName: 'test first',
            lastName: 'test last'
          }
          const actual = res.data
          expect(actual).to.deep.equal(expected)
        })
      })
    })
  })
})
