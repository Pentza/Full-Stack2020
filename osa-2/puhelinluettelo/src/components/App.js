import React, { useEffect, useState } from 'react'
import personService from '../services/persons'

import PersonForm from './PersonForm'
import Filter from './Filter'
import Persons from './Persons'
import Notification from './Notification'

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ error, setError ] = useState(null)

  useEffect(() => {
      personService
        .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
      }, [])

  const personExists = () => {
      return (
        persons.filter(person => person.name === newName).length > 0
      )
  }

  const setErrMessage = (message, error) => {
    setError(error)
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()
      if (personExists()) {
          const result = window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)
          if (result) updatePerson()
          setNewName('')
          setNewNumber('')
      } else {
          const personObject = {
              name: newName,
              number: newNumber
          }
          personService
            .create(personObject)
            .then(returnedPerson => {
              setPersons(persons.concat(returnedPerson))
              setNewName('')
              setNewNumber('')
              setErrMessage(`${newName} added`, false)
          })
          .catch(error => {
            console.log(error)
            setErrMessage(`${error.response.data.error}`, true)
          })
    }
  }
  
  const updatePerson = () => {
    const person = persons.find(p => p.name === newName)
    const changedPerson = { ...person, number: newNumber}
    personService
      .update(person.id, changedPerson)
      .then(returnedPerson => {
        setErrMessage(`${person.name} / number changed`, false)
        setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
      })
      .catch(err => {
        setErrMessage(`${person.name} was already removed from the server`, true)
        setPersons(persons.filter(p => p.id !== person.id))
      })
  }

  const deletePerson = (event) => {
    if (window.confirm()) {
      const id = event.target.value
      personService
        .remove(id)
        .then(() => {
          personService
            .getAll()
            .then(persons => {
              setErrMessage(`person deleted`, false)
              setPersons(persons)
            })
        })
    } else {
      return null
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
      setFilter(event.target.value)
  }



  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={errorMessage} error={error} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      
      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
        <Persons 
          persons={persons}
          filter={filter}
          handleDelete={deletePerson}
        />
    </div>
  )
}

export default App