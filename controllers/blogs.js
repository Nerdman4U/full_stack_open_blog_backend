const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body
  let likes
  if ( body.likes === undefined ) {
    likes = 0
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: likes
  })
  try {
    const savedItem = await blog.save()
    response.status(201).json(savedItem)
  } catch (exception) {
    next(exception)
  }
})

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

// blogRouter.delete('/:id', async (req, res) => {
//   const blog = await Blog.findById(req.params.id)
//   if (blog) {
//     Blog.deleteOne(blog).then(() => {
//       res.status(204).end()
//     })
//   }
// })

module.exports = blogRouter

