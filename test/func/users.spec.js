/* eslint-env mocha */

const axios = require('axios')
const Procmonrest = require('procmonrest')
const path = require('path')

function postHttpRequest (route, requestData) {
  const url = `http://localhost:3000/api/${route}`
  return axios.post(url, requestData, { validateStatus: false })
}

describe.skip('users route', function () {
  this.timeout(9001) // ms teams ftw

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

  context('when required fields are missing', () => {
    const invalidData = require('./invalid-user-data.json')

    invalidData.forEach((datum) => {
      describe(`the response for ${datum.description}`, () => {
        let res

        before(async () => {
          res = await postHttpRequest('users', datum.input)
        })

        it('must have the correct status code', () => {
          const expected = 400
          const actual = res.status
          expect(actual).to.equal(expected)
        })

        it('must have the expected body', () => {
          const expected = datum.output
          const actual = res.data
          expect(actual).to.deep.equal(expected)
        })
      })
    })
  })

  context('when user is created', () => {
    describe('the response', () => {
      let res

      before(async () => {
        res = await postHttpRequest('users', {
          firstName: 'test',
          lastName: 'test',
          emailAddress: 'test@example.com',
          password: 'test'
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

        describe('the location header', () => {
          it('must have the correct value', () => {
            const expected = /^\/users\/\d+$/
            const actual = res.headers.location
            expect(actual).to.match(expected)
          })
        })
      })
    })
  })
  context('when user logs in', () => {
    context('and the credentials are invalid', () => {
      describe('the response', () => {
        
        let res

        before(async () => {
          res = await postHttpRequest('users', {
            firstName: 'test',
            lastName: 'test',
            emailAddress: 'test@example.com',
            password: 'test'
          })

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
    context('and the credentials are valid', () => {
    
    })
  })
})