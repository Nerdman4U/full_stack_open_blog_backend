const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const blogRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const mongoose = require('mongoose')

// Database
const password = config.MONGODB_PASSWORD
const url = `mongodb+srv://jonitoyryla2:${password}@yonisthebest.aguxysm.mongodb.net/blogApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {console.log('connected')})
  .catch((e) => {console.log('error connecting, e:', e)})

// Middlewaret
app.use(cors())
app.use(express.json())
app.use(morgan('combined'))
app.use('/api/blogs', blogRouter)

app.use(middleware.unknown)
app.use(middleware.errorHandler)
module.exports = app

