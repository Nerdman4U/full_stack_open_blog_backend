const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  const savedItem = await blog.save()
  response.status(201).json(savedItem)
})

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
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

