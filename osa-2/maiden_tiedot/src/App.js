import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_KEY = process.env.REACT_APP_API_KEY

const CountryViewer = ({ countries, setSearch}) => {
  if (countries.length === 1) {
    return <CountryInfo country={countries[0]} />
  } else if (countries.length < 11) {
    return (
      <div>
        <ul>
          {countries.map((country, i) => {
            return (
            <li key={i}>
              {country.name}
              <button onClick={() => setSearch(country)}>show</button>
            </li>
            )
          })}
        </ul>
      </div>
    )
  } else {
    return <p>Too many matches, specify search</p>
  }
}

const CountryInfo = ({ country }) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h3>languages</h3>
      <ul>
        {country.languages.map((language, i) => <li key={i}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt="Flag" width='10%' height='10%' />
      <Weather country={country} />
    </div>

  )
}

const Weather = ({ country }) => {
  const [ weather, setWeather ] = useState({current: {}, location: {}})
  const [icon, setIcon] = useState('')
  
  useEffect(() => {
    axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${country.capital}`)
    .then(response => {
      setWeather(response.data)
      setIcon(response.data.current.condition.icon)
    })
    .catch(err => {
      setWeather('')
    })
  }, [country.capital])

  if (weather) {
    return (
      <div>
        <b>temperature: </b>{weather.current.temp_c} celsius<br/> 
        <img src={icon} alt="WeatherIcon" /><br/>
        <b>wind: </b>{weather.current.wind_kph} kph, direction {weather.current.wind_dir}
      </div>
    )
  } else {
    return (<b>Weather API unavailable</b>)
  }
}

const App = () => {
  
  const [ countries, setCounties ] = useState([])
  const [ search, setSearch ] = useState('')
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCounties(response.data)
      })
  }, [])

  const showCountry = (country) => setSearch(country.name)

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const searchFilter = (country) => country.name.toLowerCase().includes(search.toLowerCase())
  
  return (
    <div>
      <form>
        find countries <input value={search} onChange={handleSearchChange} />
      </form>
      <CountryViewer countries={countries.filter(searchFilter)} setSearch={showCountry} />
    </div>
  )
}

export default App;
