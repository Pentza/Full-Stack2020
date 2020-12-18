import React, { useState} from 'react'
const Blog = ({ blog, addLike, username, remove }) => {
  
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const removeBlog = () => {
    const { id } = blog
    remove(id)
  }

  return (
    <div>
      <div className="blogContainer" style={hideWhenVisible} >
        {blog.title} {blog.author} <button onClick={toggleVisibility}>View</button>
      </div>
      <div className="blogContainer" style={showWhenVisible} >
        <ul className="listWithoutBullets">
          <li>{blog.title} <button onClick={toggleVisibility}>Hide</button></li>
          <li>{blog.url}</li>
          <li>{blog.likes} <button onClick={addLike}>Like</button></li>
          <li>{blog.author}</li>
          {username === blog.user.username && <li><button onClick={removeBlog}>Remove</button></li>}
        </ul>
      </div>
    </div>
  )
}


export default Blog
