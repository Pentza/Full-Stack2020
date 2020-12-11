const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)

  return likes.length === 0 ?
    0 :
    likes.reduce((a, b) => a + b)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const result = blogs.reduce((prev, current) => (prev.likes < current.likes) ? current : prev)

  return {
    title: result.title,
    author: result.author,
    likes: result.likes
  }
}

const mostBlogs = (blogs) => {
  var dict = {}

  blogs.forEach(blog => {
    if (!dict[blog.author]) {
      dict[blog.author] = 0
    }
    const blogAmount = dict[blog.author]
    dict[blog.author] = blogAmount + 1
  })

  var blogAmount = 0
  var result = 0
  for (var key in dict) {
    if (dict[key] > blogAmount) {
      blogAmount = dict[key]
      result = key
    }
  }
  return {
    author: result,
    blogs: blogAmount
  }
}

const mostLikes = (blogs) => {
  var dict = {}

  blogs.forEach(blog => {
    if (!dict[blog.author]) {
      dict[blog.author] = 0
    }
    const likeAmount = dict[blog.author]
    dict[blog.author] = likeAmount + blog.likes
  })

  var likeAmount = 0
  var result = 0
  for (var key in dict) {
    if (dict[key] > likeAmount) {
      likeAmount = dict[key]
      result = key
    }
  }
  return {
    author: result,
    likes: likeAmount
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}