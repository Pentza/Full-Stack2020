const { response } = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
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

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blog identifier is called "id"', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]

  expect(Object.keys(firstBlog)[4]).toBeDefined()
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'asd',
    author: 'asd',
    url: 'asd...',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain(
    'asd'
  )
})

test('blog without title and url is not added', async () => {
  const newBlog = {
    author: 'LikeMe :3',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('adding blog without likes adds it with 0 likes', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'LikeMe :3',
    url: 'likes.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const likelessBlog = response.body[initialBlogs.length]

  expect(likelessBlog.likes).toBe(0)
})

test('deletion succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')

  expect(blogsAtEnd.body).toHaveLength(initialBlogs.length - 1)

  const titles = blogsAtEnd.body.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('update succeeds if id is valid', async () => {
  let allBlogs = await api.get('/api/blogs')
  const blogToBeUpdated = allBlogs.body[0]

  blogToBeUpdated.likes += 1

  await api
    .put(`/api/blogs/${blogToBeUpdated.id}`)
    .send(blogToBeUpdated)

  allBlogs = await api.get('/api/blogs')
  const updatedBlog = allBlogs.body[0]

  expect(updatedBlog).toEqual(blogToBeUpdated)
})

afterAll(() => {
  mongoose.connection.close()
})