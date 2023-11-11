const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { initialItems, nonExistingId, blogsInDb } = require('../utils/test_helpers')
const Blog = require('../models/blog')

beforeEach(async() => {
  await Blog.deleteMany()
  await Blog.insertMany(initialItems)
  // for (const data of initialItems) {
  //   const obj = new Blog(data)
  //   await obj.save()
  // }
})

afterAll(async() => { await mongoose.connection.close() })

describe('GET', () => {
  test('It returns blogs as json', async () => {
    let res

    res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(initialItems.length)

    res = await api.get('/api/blogs')
    const contents = res.body.map(r => r.title)
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
    const res = await api.get('/api/blogs')
    expect(res.body[0].id).toBeDefined()
  })

})

describe('POST', () => {
  test('It adds blogs', async () => {
    const item = { title:'title123' }
    await api
      .post('/api/blogs')
      .send(item)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await blogsInDb()
    expect(blogs).toHaveLength(initialItems.length + 1)
    const contents = blogs.map((blog) => blog.title)
    expect(contents).toContain('title123')
  })

  test('It does not add empty blog', async () => {
    const blogs1 = await blogsInDb()
    expect(blogs1).toHaveLength(initialItems.length)

    const item = {}
    await api
      .post('/api/blogs')
      .send(item)
      .expect(400)

    const blogs2 = await blogsInDb()
    expect(blogs2).toHaveLength(initialItems.length)
  })
})

describe('DELETE', () => {
  test('It deletes item', async () => {
    const blogsAtStart = await blogsInDb()
    const obj = blogsAtStart[0]
    await api.delete(`/api/blogs/${obj.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialItems.length - 1)

    const contents = blogsAtEnd.map(item => item.title )
    expect(contents).not.toContain(obj.title)
  })
})



