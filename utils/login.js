const User = require('../models/user')

const loggedInUser = async (body) => {
  return await User.findById(body.userId)
}

module.exports = loggedInUser

