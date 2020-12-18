import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [isError, setError] = useState(Boolean)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)

    }
  }, [])

  const setNotification = (msg, isItError) => {
    setMessage(msg)
    setError(isItError)
    setTimeout(() => {
      setMessage(null)
    }, 4000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (expectation) {
      setNotification('Wrong credentials', true)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNotification('Logged out', false)
  }

  const userInfo = () => (
    <div>
      <p>{user.name} logged in <button onClick={handleLogout}>Log-out</button></p>
    </div>
  )

  const listBlogs = () => (
    <div>
      {blogs.sort((a, b) => {
        return b.likes - a.likes
      })
      .map(blog =>
        <Blog key={blog.id} blog={blog} addLike={() => addNewLike(blog.id)} username={user.username} remove={removeBlog} />
      )}
    </div>
  )

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotification(`Added ${blogObject.title} by ${blogObject.author}`, false)
      })
      .catch(err => {
        if (err.response && err.response.data) {
          setNotification(err.response.data.error, true)
        }
      }) 
  }

  const addNewLike = (id, index) => {
    const blog = blogs.find(b => b.id === id)
    const updatedBlog = {...blog, likes: blog.likes + 1}

    blogService
      .update(id, updatedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
      .catch(err => {
        if (err.response && err.response.data) {
          setNotification(err.response.data.error, true)
        }
        console.log(err, err.response)
      }) 
  }

  const removeBlog = id => {
    let blog = blogs.filter(b => b.id === id)
    blog = blog[0]
    if (window.confirm(`Are you sure to remove ${blog.title} by ${blog.author}`)) {
      blogService
        .remove(id)
        .then(response => {
          // const blogToRemove = blogs.find(b => b.id === id)
          setBlogs(blogs.filter(b => b.id !== id))
        })
        .catch(err => {
          console.log(err)
        })
      }
  }

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={message} isError={isError} />

      {user === null ?
        <LoginForm 
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        /> :
        <div>
          {userInfo()}
          <Togglable buttonLabel='New Blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {listBlogs()}
        </div>
      }
    </div>
  )

}

export default App