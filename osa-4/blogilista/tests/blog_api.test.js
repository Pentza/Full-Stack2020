const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
let tok = ''

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)


  await User.deleteMany({})

  const passwordHash = await bcryptjs.hash('topSekret', 10)
  const user = new User({
    username: 'root',
    passwordHash
  })

  await user.save()

  const response = await api
    .post('/api/login')
    .send({ username: 'root', password: 'topSekret' })
  tok = response.body.token

})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await helper.blogsInDb()

  expect(response).toHaveLength(helper.initialBlogs.length)
})

test('blog identifier is called "id"', async () => {
  const response = await helper.blogsInDb()
  const firstBlog = response[0]

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
    .set('Authorization', 'Bearer ' + tok)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(r => r.title)

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
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
    .set('Authorization', 'Bearer ' + tok)
    .send(newBlog)
    .expect(400)

  const response = await helper.blogsInDb()
  expect(response).toHaveLength(helper.initialBlogs.length)
})

test('adding blog without likes adds it with 0 likes', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'LikeMe :3',
    url: 'likes.com'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer ' + tok)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await helper.blogsInDb()
  const likelessBlog = response[helper.initialBlogs.length]

  expect(likelessBlog.likes).toBe(0)
})

test('deletion succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('update succeeds if id is valid', async () => {
  let allBlogs = await helper.blogsInDb()
  const blogToBeUpdated = allBlogs[0]

  blogToBeUpdated.likes += 1

  await api
    .put(`/api/blogs/${blogToBeUpdated.id}`)
    .send(blogToBeUpdated)

  allBlogs = await helper.blogsInDb()
  const updatedBlog = allBlogs[0]

  expect(updatedBlog).toEqual(blogToBeUpdated)
})

describe('when there is initially one user at DB', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testUser123',
      name: 'Testi Testaaja',
      password: 'salasana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

test('creation fails with too short password', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'Shortpassword',
    name: 'Mr. Shortpass',
    password: 'sp',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('password need to be atleast 3 characters long')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})


afterAll(() => {
  mongoose.connection.close()
})