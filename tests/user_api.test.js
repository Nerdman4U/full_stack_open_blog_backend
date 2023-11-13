const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { usersInDb } = require('./test_helpers')
const User = require('../models/user')


describe('POST', () => {
  beforeEach (async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password',10)
    const user = new User({ username:'username1', name:'name1', passwordHash:passwordHash })
    await user.save()
  }, 30000)

  test('it creates an user', async () => {
    const usersAtStart = await usersInDb()
    const user = {
      username: 'username2',
      name: 'name2',
      password: 'password2'
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .catch(e => {
        console.log(e)
        throw new Error(e)
      })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain('username1')
    expect(usernames).toContain('username2')
  })

  test('it does not create an user with existing username', async () => {
    const usersAtStart = await usersInDb()
    const user = {
      username: 'username1',
      name: 'name1',
      password: 'password1'
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect((res) => {
        expect(res.res.text).toMatch(/to be unique/)
      })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})
