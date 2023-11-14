const User = require('../models/user')

/**
 * Return logged in user.
 *
 * @param {*} request
 * @returns object
 */
const loggedInUser = async (request) => {
  if (!request.loggedInUser) {
    return null
  }
  if (!request.loggedInUser.id) {
    throw new Error('User not found')
  }
  return await User.findById(request.loggedInUser.id)
}

module.exports = loggedInUser

