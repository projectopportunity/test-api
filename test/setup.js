const axios = require('axios')
const chai = require('chai')

chai.use(require('chai-as-promised'))

global.expect = chai.expect

global.postHttpRequest = (route, requestData) => {
  const url = `http://localhost:3000/api/${route}`
  return axios.post(url, requestData, { validateStatus: false })
}

/**
 * Increased timeout value due to MS Teams.
 *
 * @type {Number}
 */
global.ttl = 14000
