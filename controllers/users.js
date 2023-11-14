const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const loggedInUser = require('../utils/login')

/**
 * Get all users
 */
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

/**
 * Create new user
 */
usersRouter.post('/', async (request, response) => {
  console.log('usersRouter.post')
  jwt.verify(request.token, process.env.SECRET)

  const body = request.body
  const loggedIn = request.loggedInUser //await loggedInUser(request)
  if (!loggedIn) {
    logger.error('No user, id:', body.userId)
    return response.status(400).json({ error: 'user not found' })
  }

  // new user
  const { username, name, password } = body
  if (username === undefined || password === undefined) {
    response.status(400).json({
      error: 'username or password missing'
    })
  }
  if (password.length < 3) {
    response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username, name, passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter

