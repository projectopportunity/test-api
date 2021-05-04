/* eslint-env mocha */

const axios = require('axios')
const Procmonrest = require('procmonrest')
const path = require('path')

function postHttpRequest (route, requestData) {
  const url = `http://localhost:3000/api/${route}`
  return axios.post(url, requestData, { validateStatus: false })
}

describe('route that does not exist', function () {
  this.timeout(9001) // ms teams ftw

  const serverProcess = new Procmonrest({
    waitFor: /listening/,
    saveLogTo: path.join(__dirname, 'notfound.log')
  })

  before(() => {
    return serverProcess.start()
  })

  after(() => {
    if (serverProcess.isRunning) {
      return serverProcess.stop()
    }
  })

  describe('the response', () => {
    let res

    before(async () => {
      res = await postHttpRequest('this/route/does/not/exist', {})
    })

    it('must have correct status code', () => {
      const expected = 404
      const actual = res.status
      expect(actual).to.equal(expected)
    })

    it('must be empty', () => {
      const expected = ''
      const actual = res.data
      expect(actual).to.equal(expected)
    })
  })
})
