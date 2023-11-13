const errorHandler = (error, request, response, next) => {
  console.log('MESSAGE', error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).send({ error: 'invalid token' })
  }

  next(error)
}

const unknown = (req,res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

module.exports = {
  unknown,
  errorHandler
}


