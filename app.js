const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const Blog = require('./models/blog')

app.use(cors())
app.use(express.json())
app.use(morgan('combined'))

const unknown = (req,res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  })
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

app.use(unknown)

module.exports = app

