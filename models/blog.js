const config = require('../config')
const mongoose = require('mongoose')

const password = config.MONGODB_PASSWORD

const url = `mongodb+srv://jonitoyryla2:${password}@yonisthebest.aguxysm.mongodb.net/blogApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {console.log('connected')})
  .catch((e) => {console.log('error connecting, e:', e)})

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
