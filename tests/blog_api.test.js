const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const initialItems = [
  { 'title':'title1', 'author':'author1', 'url':'url1', 'likes':1 },
  { 'title':'title2', 'author':'author2', 'url':'url2', 'likes':2 },
  { 'title':'title3', 'author':'author3', 'url':'url3', 'likes':3 },
  { 'title':'title4', 'author':'author4', 'url':'url4', 'likes':4 }
]

test('It returns blogs as json', async () => {
  const res = await api.get('/api/blogs')
  expect(res.body).toHaveLength(initialItems.length)
})

test('It returns a spesific note', async () => {
  const res = await api.get('/api/blogs')
  const contents = res.body.map(r => r.title)
  expect(contents).toContain('title1')
})

test('It adds blogs', async () => {
  const item = new Blog(initialItems[0])
  await api
    .post('/api/blogs')
    .send(item)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

test('It does not add empty blog', async() => {
  const item = new Blog({})
  await api
    .post('/api/blogs')
    .send(item)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

beforeAll(async() => {
  await Blog.deleteMany()
  for (const data of initialItems) {
    const obj = new Blog(data)
    await obj.save()
  }
})

afterAll(async() => { await mongoose.connection.close() })

