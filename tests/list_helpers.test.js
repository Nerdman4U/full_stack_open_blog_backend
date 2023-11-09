const listHelper = require('../utils/list_helpers')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
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
