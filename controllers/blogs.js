const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const loggedInUser = require('../utils/login')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('Authorization')
  console.log('getTokenFrom()', authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.replace('Bearer ', '')
    console.log('getTokenFrom()', token)
    return token
  }
  return null
}

/**
 * Get all blogs
 */
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

/**
 * Create new blog
 */
blogRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  if (!token) {
    console.error('No token')
    return
  }
  const decodeToken = jwt.verify(token, process.env.SECRET)
  console.log('blogRouter()', decodeToken.id)
  if (!decodeToken.id) {
    return response.status(401).json({ error: 'token missing' })
  }

  const userJson = request.loggedInUser
  if (!userJson) {
    return response.status(400).json({ error: 'user not found' })
  }
  const user = await loggedInUser(request)

  let likes = ( body.likes ) ? body.likes : 0
  if (body.title === undefined) {
    return response.status(400).json({ error: 'title missing' })
  }
  if (body.url === undefined) {
    return response.status(400).json({ error: 'url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: user.name,
    url: body.url,
    likes: likes,
    user: user.id
  })
  const savedItem = await blog.save()
  response.status(201).json(savedItem)

  let blogs = user.blogs || []
  blogs = blogs.concat(savedItem._id)
  user.blogs = blogs
  await user.save().catch((e) => {
    console.log(e)
  })

})

/**
 * Get blog
 */
blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

/**
 * Delete blog
 */
blogRouter.delete('/:id', async (request, res) => {
  jwt.verify(request.token, process.env.SECRET)

  const body = request.body
  //const user = await loggedInUser(body)
  const userJson = request.loggedInUser
  if (!userJson) {
    logger.error('No user, id:', body.userId)
    return res.status(400).json({ error: 'user not found' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }
  if (!blog.user) {
    return res.status(404).json({ error: 'user not found' })
  }

  if (blog.user.toString() !== userJson.id.toString()) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  res.status(204).end()
})

/**
 * Update blog
 */
blogRouter.put('/:id', async (request, res) => {
  console.log('request.token:', request.token)
  jwt.verify(request.token, process.env.SECRET)

  const body = request.body
  const userJson = request.loggedInUser
  if (!userJson) {
    return res.status(400).json({ error: 'user not found' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.body.id, {
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

