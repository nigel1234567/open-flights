import React, { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Header from './Header'
import ReviewForm from './ReviewForm'
import Review from './Review'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`
const Column = styled.div`
  background: #fff;
  height: 100vh;
  overflow: scroll;

  &:last-child {
    background: #000;
  }
`

const Main = styled.div`
  padding-left: 50px;
`

const Airline = () => {
  const [airline, setAirline] = useState({}) // Empty object
  const [review, setReview] = useState({}) // Empty object, map to object
  const [loaded, setLoaded] = useState(false) // Prevent error of calling attributes on data before setting a value of airline object
  const {slug} = useParams()

  useEffect(() => {
    // Construct url for api endpoint 
    const url = `/api/v1/airlines/${slug}`

    // Get data from api
    axios.get(url)
    .then( resp => {
      // Set data
      setAirline(resp.data) 
      setLoaded(true)
    })
    .catch( resp => console.log(resp) )
  }, [])

  // Handle changes in input field
  const handleChange = (e) => {
    e.preventDefault()

    setReview(Object.assign({}, review, {[e.target.name]: e.target.value}))

    console.log('review:', review)
  }

  // Handle submit for form
  const handleSubmit = (e) => {
    e.preventDefault()

    // CSRF Token
    const csrfToken = document.querySelector('[name=csrf-token]').content
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

    // Posting reviews
    const airline_id = airline.data.id
    axios.post('/api/v1/reviews', {review, airline_id})
    .then(resp => {
      const included = [...airline.included, resp.data.data]
      setAirline({...airline, included}) // Post form details to review
      setReview({title: '', description: '', score: 0}) // Set to be empty after posting
    })
    .catch(resp => {})
  }

  // Set ratings
  const setRating = (score, e) => {
    e.preventDefault();

    setReview({...review, score}) // Pass through the score that was given in this method
  }

  // Let reviews be undefined
  let reviews

  // Once page is loaded, then show the reviews (if not, there will be an error for trying to show reviews before page loads)
  if (loaded && airline.included) {
    reviews = airline.included.map( (item, index) => {
      return (
        <Review
          key={index}
          attributes={item.attributes}
        />
      )
    })
  }


  return (
    <Wrapper>
    {
      loaded &&
      <Fragment>
        <Column>
          <Main>
            <Header 
            attributes={airline.data.attributes} 
            reviews={airline.included}
            />
            {reviews}
          </Main>
        </Column>
        <Column>
          <ReviewForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setRating={setRating}
            attributes={airline.data.attributes}
            review={review}
          />
        </Column>
      </Fragment>
    }
    </Wrapper>
  )
}

export default Airline