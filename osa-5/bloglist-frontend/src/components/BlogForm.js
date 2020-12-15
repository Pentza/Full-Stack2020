import React from 'react'

const BlogForm = (props) => {
  return (
    <div>
      <form onSubmit={props.addBlog}>
        <div>
          Title: 
          <input
          type='text'
          value={props.title}
          name='Title'
          onChange={({ target }) => props.setTitle(target.value)}
          />
        </div>
        <div>
          Author: 
          <input
          type='text'
          value={props.author}
          name='Author'
          onChange={({ target }) => props.setAuthor(target.value)}
          />
        </div>
        <div>
          Url: 
          <input
          type='text'
          value={props.url}
          name='Url'
          onChange={({ target }) => props.setUrl(target.value)}
          />
        </div>
        <button type='submit'>Add blog</button>
      </form>
    </div>
  )
}

export default BlogForm