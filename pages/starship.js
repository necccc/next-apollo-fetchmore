import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import App from '../components/App'
import Header from '../components/Header'

function Starship ({
  data: { loading, Starship, error },
  fetchFull
}) {
  return (
    <App>
      <Header />
      <ul>
        { Object.entries(Starship)
            .map(([label, value]) => ( <li key={label}>
              <strong>{ label }</strong> { value }
            </li> ))}
      </ul>

      <button onClick={() => fetchFull()}>fetch full</button>
    </App>
  )
}

Starship.getInitialProps = () => {
  return {
    id: "49b5f6fd159c00::10"
  }
}

export const starship = gql`
  query starship($id: ID) {
    Starship(id: $id) {
      name
      id
    }
  }
`

export const fullStarship = gql`
  query fullStarship($id: ID) {
    Starship(id: $id) {
      name
      id
      picture
      model
      starship_class
      manufacturer
      hyperdrive_rating
      cargo_capacity
      length
      passengers
      crew
      consumables
    }
  }
`

export default graphql(starship, {
  options: ({ id }) => {
    return {
      variables: {
        id
      }
    }
  },
  props: ({ data, ownProps }) => {
    const id = ownProps.id
    return ({
      data,
      fetchFull: () => {
        return data.fetchMore({
					query: fullStarship,
					variables: {
						id
					},
					updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult
            }

            return (Object.assign({}, previousResult, {
              // Append the new posts results to the old one
              Starship: Object.assign({}, previousResult.Starship, fetchMoreResult.Starship)
            }))
					}
				})
      }
    })
  }
})(Starship)
