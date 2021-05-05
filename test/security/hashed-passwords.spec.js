/* eslint-env mocha */
const hash = require('../../app/node_modules/@api/utils/hash/index.js')
const UserModel = require('../../app/node_modules/@api/datastore/models/Users.js')
const T = require('../../app/node_modules/@api/datastore/index.js')

describe('the user account passwords that are stored in the database', () => {
  let user

  before(async () => {
    const instance = T()

    await instance.init('sqlite::memory:')

    await instance.createUser(
      {
        username: 'test@email.com',
        password: 'test',
        name: {
          first: 'firstName',
          last: 'lastName'
        }
      }
    )

    user = await UserModel(instance.provider).findOne({
      where: { emailAddress: 'test@email.com' }
    })
  })

  after(() => {
    // delete user - eventually
  })

  it('should be hashed', () => {
    const expected = true
    const actual = hash.compareToHash('test', user.password)
    expect(actual).to.equal(expected)
  })
})
