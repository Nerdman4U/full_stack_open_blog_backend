const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const { initialItems, blogsInDb, usersInDb, nonExistingId } = require('./test_helpers')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

let loggedInUser, res
beforeEach(async() => {
  await Blog.deleteMany()
  await Blog.insertMany(initialItems)

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password1',10)
  loggedInUser = new User({ username:'username1', name:'name1', passwordHash:passwordHash })
  await loggedInUser.save()

  res = await api.post('/api/login').send({
    username: loggedInUser.username,
    password: 'password1'
  })
})

afterAll(async() => { await mongoose.connection.close() })

describe('GET', () => {
  test('It returns blogs as json', async () => {
    let blogs
    blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(initialItems.length)

    blogs = await api.get('/api/blogs')
    const contents = blogs.body.map(r => r.title)
    expect(contents).toContain('title1')
  })

  test('It returns one blog', async () => {
    const blogsAtStart = await blogsInDb()
    const obj = blogsAtStart[0]
    const result = await api
      .get(`/api/blogs/${obj.id}`)
      .expect(200)
      .expect('Content-Type', /json/)

    expect(result.body).toEqual(obj)
  })

  test('It get object with id', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body[0].id).toBeDefined()
  })

  test('It returns status 400 with wrong id', async () => {
    const invalidId = await nonExistingId()
    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(404)
  })

})

describe('POST', () => {
  test('It adds blogs', async () => {
    const item = {
      title: 'title5',
      url: 'url5',
      userId: loggedInUser.id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${res.body.token}`)
      .send(item)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await blogsInDb()
    expect(blogs).toHaveLength(initialItems.length + 1)
    const contents = blogs.map((blog) => blog.title+blog.url).join('')
    expect(contents).toMatch(/title5/)
    expect(contents).toMatch(/url5/)
  })

  test('It responses with status code 400 without title or url', async () => {
    let item
    item = {
      title:'title5',
      userId: loggedInUser.id
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${res.body.token}`)
      .send(item)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    item = {
      url:'url5',
      userId: loggedInUser.id
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${res.body.token}`)
      .send(item)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('It does not add empty blog', async () => {
    const blogs1 = await blogsInDb()
    expect(blogs1).toHaveLength(initialItems.length)

    const item = {}
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${res.body.token}`)
      .send(item)
      .expect(400)

    const blogs2 = await blogsInDb()
    expect(blogs2).toHaveLength(initialItems.length)
  })

  test('It adds 0 likes if undefined', async () => {
    const item = {
      title: 'testi2',
      userId: loggedInUser.id,
      url: 'url2'
    }
    await api
      .post('/api/blogs')
      .set('authorization', `Bearer ${res.body.token}`)
      .send(item)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs2 = await blogsInDb()
    const blog = blogs2.find((item) => {
      return item.title === 'testi2'
    })
    expect(blog.likes).toBe(0)
  })
})

describe('DELETE', () => {
  test('It deletes item', async () => {
    const blogsAtStart = await blogsInDb()
    const obj = blogsAtStart[0]

    // Add logged in user to this blog
    const thisBlog = await Blog.findById(obj.id)
    thisBlog.user = loggedInUser.id
    await thisBlog.save()

    await api.delete(`/api/blogs/${obj.id}`)
      .set('Authorization', `Bearer ${res.body.token}`)
      .send({ userId: loggedInUser.id })
      .expect(204)
      .catch((e) => {
        console.log(e)
      })

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialItems.length - 1)
    const contents = blogsAtEnd.map(item => item.title )
    expect(contents).not.toContain(obj.title)
  })

  test('It do not delete if wrong owner', async () => {
    const blogsAtStart = await blogsInDb()
    const obj = blogsAtStart[0]
    await api.delete(`/api/blogs/${obj.id}`)
      .set('Authorization', `Bearer ${res.body.token}`)
      .send({ userId: loggedInUser.id })
      .expect(404)
      .catch((e) => {
        console.log(e)
      })

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialItems.length)
    const contents = blogsAtEnd.map(item => item.title )
    expect(contents).toContain(obj.title)
  })
})

describe('PUT', () => {
  test('It updates item', async () => {
    const blogsAtStart = await blogsInDb()
    const obj = blogsAtStart[0]
    const newJson = { ...obj, likes: 5 }

    const newObj = await api
      .put(`/api/blogs/${obj.id}`)
      .send({ userId: loggedInUser.id })
      .set('authorization', `Bearer ${res.body.token}`)
      .send(newJson)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(newObj.body.likes).toBe(5)
    expect(newObj.body.title).toBe('title1')
  })
})

