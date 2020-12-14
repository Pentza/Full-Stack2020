const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [{
  title: 'Testi blogi',
  author: 'Testaaja',
  url: 'testi.test',
  likes: 0
},
{
  title: 'Blogi aiheesta x',
  author: 'Blogaaja',
  url: 'aihe.blogi.fi',
  likes: 21
},
{
  title: 'Bloggaaja pro',
  author: 'nimimerkki',
  url: 'blogiblog.xyz',
  likes: 9
}
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const firstUserInDb = async () => {
  const users = await User.find({})
  return users
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  firstUserInDb
}