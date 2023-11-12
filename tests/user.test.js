const bcrypt = require('bcrypt')
const User = require('../models/user')
//const { initialUsers, usersInDb } = require('./test_helpers')

describe('When there is initially one user in db', () => {
  beforeEach (async () => {
    // console.log(1)
    // await User.deleteMany({username:'username'})
    // console.log(2)
    // const passwordHash = await bcrypt.hash('password',10)
    // console.log(3)
    // const user = new User({ username:'username', name:'name', password:passwordHash })
    // console.log(4)
    // await user.save()
  }, 30000)

  test('It creates an user', async () => {
    const userJson = {
      username: 'username1',
      name: 'name1',
      password: 'password'
    }
    const user = new User(userJson)
    const savedUser = await user.save()
    expect(savedUser).username === 'username1'
    expect(savedUser).name === 'name1'
    expect(savedUser).password === bcrypt.hash('password',10)
  }, 30000)
})

