const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  if (!request.body.password) {
    logger.info('Body:  ', request.body)
  } else {
    logger.info('Body:  ', request.body.username, request.body.name )
  }
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    status: 404,
    error: 'unknown endpoint'
  })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({
      status: 400,
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      status: 400,
      error: error.message
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      status: 401,
      error: 'invalid token'
    })
  }

  logger.error(error.message)

  next()
  return request.token
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }
  

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}