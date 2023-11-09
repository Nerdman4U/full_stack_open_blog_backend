const logger = require('../utils/logger')

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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}