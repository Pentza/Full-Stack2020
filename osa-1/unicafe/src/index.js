import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const StaticLine = (props) => <tr><td>{props.text}</td><td>{props.value}</td></tr>

const Button = (props) => <button onClick={props.handleClick}>{props.text}</button>

const Statistics = ({ good, neutral, bad, total}) => {
  if (total === 0) return <div><p>No feedback given</p></div>
  return (
  <div>
    <table>
      <tbody>
        <StaticLine text={"good"} value={good} />
        <StaticLine text={"neutral"} value={neutral} />
        <StaticLine text={"bad"} value={bad} />
        <StaticLine text={"total"} value={total} />
        <StaticLine text={"average"} value={(good * 1 + bad * -1) / total} />
        <StaticLine text={"positive"} value={good / total * 100 + " %"} />
      </tbody>
    </table>
  </div>
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad


  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text={"good"} />
      <Button handleClick={() => setNeutral(neutral + 1)} text={"neutral"} />
      <Button handleClick={() => setBad(bad + 1)} text={"bad"} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
