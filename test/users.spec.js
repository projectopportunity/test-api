/* eslint-env mocha */
const { expect } = require('chai')
const axios = require('axios')
const Procmonrest = require('procmonrest')
const path = require('path')

describe('users route', function () {
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
    const invalidData = [
      {
        description: 'missing first name',
        input: {
          lastName: 'test',
          emailAddress: 'test@example.com',
          password: 'test'
        },
        output: {
          errors: ['missing required field firstName']
        }
      },
      {
        description: 'missing last name',
        input: {
          firstName: 'test',
          emailAddress: 'test@example.com',
          password: 'test'
        },
        output: {
          errors: ['missing required field lastName']
        }
      },
      {
        description: 'missing first and last name',
        input: {
          emailAddress: 'test@example.com',
          password: 'test'
        },
        output: {
          errors: [
            'missing required field firstName',
            'missing required field lastName'
          ]
        }
      }
    ]

    invalidData.forEach((datum) => {
      describe(`the response for ${datum.description}`, () => {
        let res

        before(() => {
          const data = datum.input

          return axios.post('http://localhost:3000/api/users', data, { validateStatus: false })
            .then((response) => {
              res = response
            })
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

        describe('the location header', () => {
          it('must have the correct value', () => {
            const expected = '/'
            const actual = res.headers.location
            expect(actual).to.equal(expected)
          })
        })
      })
    })
  })
})
