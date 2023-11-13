const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.userId === undefined) {
    return response.status(400).json({ error: 'userId missing' })
  }
  const user = await User.findById(body.userId)
  if (!user) {
    return response.status(400).json({ error: 'user not found' })
  }

  let likes = ( body.likes ) ? body.likes : 0
  if (body.title === undefined) {
    return response.status(400).json({ error: 'title missing' })
  }
  if (body.url === undefined) {
    return response.status(400).json({ error: 'url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: likes,
    user: user.id
  })

  const savedItem = await blog.save()
  response.status(201).json(savedItem)

  let blogs = user.blogs || []
  blogs = blogs.concat(savedItem._id)
  user.blogs = blogs
  const res = await user.save().catch((e) => {
    console.log(e)
  })
  console.log('res:', res)
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

blogRouter.put('/:id', async (req, res, next) => {
  const body = req.body
  const updatedBlog = await Blog.findByIdAndUpdate(req.body.id, {
    likes: body.likes
  }, { new: true, runValidators:true, context:'query' })

  if (updatedBlog)  {
    res.json(updatedBlog)
    res.status(200).end()
  } else {
    res.status(404).end()
  }

})

module.exports = blogRouter

