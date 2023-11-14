const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { usersInDb } = require('./test_helpers')
const User = require('../models/user')


let loginRes, loggedInUser
describe('POST', () => {
  beforeEach (async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password1',10)
    const user = new User({ username:'username1', name:'name1', passwordHash:passwordHash })
    await user.save()

    loginRes = await api.post('/api/login').send({
      username: user.username,
      password: 'password1'
    })
    if (loginRes.error) {
      console.log('Error', loginRes.error)
    }
    loggedInUser = user
  })

  test('it creates an user', async () => {
    const usersAtStart = await usersInDb()
    const user = {
      username: 'username2',
      name: 'name2',
      password: 'password2',
      userId: loggedInUser.id
    }

    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .send(user)
      .expect(201)

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
      name: 'name3',
      password: 'password3',
      userId: loggedInUser.id
    }
    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .send(user)
      .expect(400)
      .expect((res) => {
        expect(res.res.text).toMatch(/to be unique/)
      })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  }, 20000)

  test('it does not create an user with short username', async () => {
    const usersAtStart = await usersInDb()
    const user = {
      username: 'u1',
      name: 'name1',
      password: 'password1',
      userId: loggedInUser.id
    }
    await api
      .post('/api/users')
      .send(user)
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .expect(400)
      .expect((res) => {
        expect(res.res.text).toMatch(/short/)
      })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('it does not create an user with short password', async () => {
    const usersAtStart = await usersInDb()
    const user = {
      username: 'username2',
      name: 'name2',
      password: '2',
      userId: loggedInUser.id
    }
    await api
      .post('/api/users')
      .send(user)
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .expect(400)
      .expect((res) => {
        expect(res.res.text).toMatch(/at least 3 characters long/)
      })

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})
