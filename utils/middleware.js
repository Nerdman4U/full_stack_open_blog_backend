const jwt = require('jsonwebtoken')
const logger = require('./logger')

const tokenFromHeaders = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

const loggedInUser = (request, response, next) => {
  jwt.verify(request.token, process.env.SECRET, function(err, decoded) {
    //console.log('decoded:', decoded, request.token)
    request.loggedInUser = decoded
  })
  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    logger.test(error)
    return response.status(400).send({ error: 'invalid token' })
  } else if (error.name === 'Error') {
    logger.test(error)
    return response.status(500).send({ error: 'Internal server error' })
  }
  console.log(error)
  next(error)
}

const unknown = (req, res, next) => {
  res.status(404).send({ error: 'Unknown endpoint' })
  next()
}

module.exports = {
  unknown,
  errorHandler,
  tokenFromHeaders,
  loggedInUser
}

