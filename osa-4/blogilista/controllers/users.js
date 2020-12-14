const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })

  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password.length < 3 || body.password === undefined) {
    return response.status(400).json({
      status: 400,
      error: 'password need to be atleast 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcryptjs.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.status(200).json(savedUser.toJSON())
  } catch (exception) {
    response.status(400).json({
      status: 400,
      error: '`username` to be unique'
    }).end()
  }
})

module.exports = usersRouter