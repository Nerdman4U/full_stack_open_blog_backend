const Blog = require('../models/blog')
const User = require('../models/user')

const initialItems = [
  { 'title':'title1', 'author':'author1', 'url':'url1', 'likes':1 },
  { 'title':'title2', 'author':'author2', 'url':'url2', 'likes':2 },
  { 'title':'title3', 'author':'author3', 'url':'url3', 'likes':3 },
  { 'title':'title4', 'author':'author4', 'url':'url4', 'likes':4 }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'Testaus nimi' })
  await blog.save()
  await Blog.findByIdAndDelete(blog.id)
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON() )
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map((blog) => blog.toJSON() )
}

module.exports = {
  initialItems,
  nonExistingId,
  blogsInDb,
  usersInDb
}

