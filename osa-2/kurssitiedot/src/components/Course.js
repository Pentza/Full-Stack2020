import React from 'react'

const Header = ({ name }) => {
    return <h1>{name}</h1>
  }
  
const Course = ({ course }) => {
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }
  
const Content = ({ parts }) => {
    return (
      <div>
        <dl>
          {parts.map(part =>
            <Part key={part.id} name={part.name} exercises={part.exercises} />
          )}
        </dl>
      </div>
    )
  }
  
const Part = ({ name, exercises }) => {
    return <p>{name} {exercises}</p>
  }
  
const Total = ({ parts }) => {
    const totals = parts.map(part => part.exercises)
    const reducer = (total, newValue) => total + newValue;
    
    return (
      <h4>total of {totals.reduce(reducer)} exercises</h4>
    )
  }

export default Course
