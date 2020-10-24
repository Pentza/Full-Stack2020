import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const DisplayAnecdote = ({anecdote, voteAmount}) => {
  return (
    <p>
      {anecdote}
      <br />
      has {voteAmount} votes.
    </p>
  )
}


const App = (props) => {
  const randomAnecdoteIndex = () => Math.floor(Math.random() * props.anecdotes.length)

  const [selected, setSelected] = useState(randomAnecdoteIndex)
  const [votes, setVotes] = useState(new Array(props.anecdotes.length).fill(0))
  const [topAnecdote, setTopAnecdote] = useState(selected)

  const handleNext = () => setSelected(Math.floor(Math.random() * props.anecdotes.length))

  const handleVote = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    setVotes(votesCopy)

    if (votesCopy[selected] > votesCopy[topAnecdote]) setTopAnecdote(selected)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <DisplayAnecdote anecdote={props.anecdotes[selected]} voteAmount={votes[selected]} />

      <button onClick={handleNext}>Next anecdote</button>
      <button onClick={handleVote}>Vote</button>

      <h1>Anecdote with most votes</h1>
      <DisplayAnecdote anecdote={props.anecdotes[topAnecdote]} voteAmount={votes[topAnecdote]} />
    </div>
  )
  
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
