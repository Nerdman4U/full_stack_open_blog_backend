const express = require('express')
//require('express-async-errors')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// Database
const url = config.MONGODB_URI
console.log('Connecting to database', url)
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => { logger.info('connected') })
  .catch((e) => { logger.info('error connecting, e:', e) })

app.use(cors())
app.use(express.json()) // json parser
app.use(morgan('combined'))
//app.use(middleware.authorizationToken)
app.use(middleware.getTokenFrom)

// Routes
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknown)
module.exports = app

