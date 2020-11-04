import React from 'react'

const Persons = (props) => {
    const caseSensitiveFilter = (person) => (
        person.name.toLowerCase().startsWith(
            props.filter.toLowerCase()
        )
    )
    return (
        <ul>
            {props.persons
                .filter(caseSensitiveFilter)
                .map(person => (
                    <li key={person.id}>{person.name} {person.number} <button value={person.id} onClick={props.handleDelete}>delete</button></li>
                ))
            }
        </ul>
    )
}


export default Persons