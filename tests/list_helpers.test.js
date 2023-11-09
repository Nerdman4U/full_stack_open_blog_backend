const listHelper = require('../utils/list_helpers')
const blogs2 = require('../data/blogs_for_test.json')

test('Dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('Total likes', () => {
  test('It returns total likes', () => {
    const blogs = [
      { 'title': 'testi1', 'likes':1 },
      { 'title': 'testi2', 'likes':2 },
      { 'title': 'testi3', 'likes':3 }
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(6)
  })
  test('It returns totals when only one', () => {
    const blogs = [
      { 'title': 'testi1', 'likes':12 }
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(12)
  })
  test('It returns totals when empty', () => {
    const blogs = [
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  })
})

describe('Most likes', () => {
  test('It returns which has most likes', () => {
    const blogs = [
      { 'title': 'testi1', 'likes':1 },
      { 'title': 'testi2', 'likes':2 },
      { 'title': 'testi3', 'likes':3 }
    ]
    const result = listHelper.favouriteBlog(blogs)
    expect(result.title).toBe('testi3')
  })

  test('It return empty object when empty list', () => {
    const blogs = [
    ]
    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual({})
  })
})


describe('Most blogs', () => {
  test('It returns which has most likes', () => {
    const result = listHelper.mostBlogs(blogs2)
    expect(result.name).toBe('Robert C. Martin')
    expect(result.blogs).toBe(3)
  })
  test('It returns empty object when empty list', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({})
  })

})

describe('Most likes', () => {
  test('It returns which has most likes', () => {
    const result = listHelper.mostLikes(blogs2)
    expect(result.name).toBe('Edsger W. Dijkstra')
    expect(result.likes).toBe(17)
  })
  test('It returns empty object when empty list', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual({})
  })

})
