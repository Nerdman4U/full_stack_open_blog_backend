const logger = require('../utils/logger')
const lodash = require('lodash')

const dummy = () => {
  return 1
}
const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => {
    return sum + item.likes
  },0)
}
const favouriteBlog = (blogs) => {
  const likes = blogs.map((item) => {
    return item.likes
  })
  if (likes.length < 1) return {}

  const most = Math.max(...likes)
  return blogs.find((item) => item.likes === most)
}

const mostBlogs = (blogs) => {
  if (Object.keys(blogs).length < 1) return {}
  const result = lodash.countBy(blogs, (blog) => { return blog.author })
  const most = Math.max(...lodash.values(result))
  const name = lodash.findKey(result, (obj) => {
    return obj === most
  })
  return { name: name, blogs: most }
}


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs
}