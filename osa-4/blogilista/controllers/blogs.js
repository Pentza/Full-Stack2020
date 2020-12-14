const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const token = request.token
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id || !decodedToken) {
      return response.status(401).json({
        error: 'token missing or invalid '
      }).end()
    }

    const user = await User.findById(decodedToken.id)


    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id

    })


    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const userid = decodedToken.id.toString()
    const blogToBeDeleted = await Blog.findById(request.params.id)
    const blogUserId = blogToBeDeleted.user.toString()

    if (blogUserId !== userid) {
      return response.status(401).json({
        error: 401,
        error: 'Unauthorized'
      })
    }
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true
  })
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter