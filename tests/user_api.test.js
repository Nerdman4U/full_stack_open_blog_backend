const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

//const { useresInDb, nonExistingId } = require('./test_helpers')
const User = require('../models/user')


describe('POST', () => {
  beforeEach (async () => {
    // await User.deleteMany({})
    // const passwordHash = await bcrypt.hash('password',10)
    // const user = new User({ username:'username', name:'name', password:passwordHash })
    // await user.save()
  }, 30000)

  test('it creates an user', async () => {
    const user = {
      username: 'username',
      name: 'name',
      password: 'password'
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
  }, 30000)

})
