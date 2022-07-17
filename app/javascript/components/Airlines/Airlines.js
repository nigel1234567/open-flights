import React, {useState, useEffect, Fragment } from 'react' // Fragment groups a list of children without adding extra nodes to the DOM
import axios from 'axios' // Makes API request from react side
import Airline from './Airline'
import styled from 'styled-components'

const Home = styled.div`
  text-align: center;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`
const Header = styled.div`
  padding: 100px 100px 10px 100px;

  h1 {
    font-size: 42px;
  }
`
const Subheader = styled.div`
  font-weight: 300;
  font-size: 26px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  width: 100%;
  padding: 20px;
`

const Airlines = () => {
  const [airlines, setAirlines] = useState([])

  useEffect(() => {
    // Get all of our airlines from api
    //Update airlines in our state

    // Request json data from Rails API to React component
    axios.get('/api/v1/airlines.json')
    .then( resp => {setAirlines(resp.data.data)})
    .catch( resp => console.log(resp) )
  }, [airlines.length]) // Only re-run request when number of airlines changes

  const grid = airlines.map( item => {
    return (<Airline 
      key={item.attributes.name}
      attributes={item.attributes}
    />)
  })

  return (
  <Home>
    <Header>
      <h1>OpenFlights</h1>
      <Subheader>Honest, unbiased airline reviews</Subheader>
    </Header>
    <Grid>
      {grid}
    </Grid>
  </Home>
    )
}

export default Airlines