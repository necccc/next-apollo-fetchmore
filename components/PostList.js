import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'
import Link from 'next/link'

function PostList ({
  data: { loading, allStarships, error },
  loadMorePosts
}) {
  if (error) return <ErrorMessage message='Error loading posts.' />

    return (
      <section>
        <ul>
          {allStarships.map((post, index) => (
            <li key={post.id}>
              <div>
                <span>{index + 1}. </span>
                <Link href={`/starship`}>
                <a >{post.name}</a>
                </Link>
              </div>
            </li>
          ))}
        </ul>

          <button onClick={() => loadMorePosts()}>
            {' '}
            {loading ? 'Loading...' : 'Show More'}{' '}
          </button>

        <style jsx>{`
          section {
            padding-bottom: 20px;
          }
          li {
            display: block;
            margin-bottom: 10px;
          }
          div {
            align-items: center;
            display: flex;
          }
          a {
            font-size: 14px;
            margin-right: 10px;
            text-decoration: none;
            padding-bottom: 0;
            border: 0;
          }
          span {
            font-size: 14px;
            margin-right: 5px;
          }
          ul {
            margin: 0;
            padding: 0;
          }
          button:before {
            align-self: center;
            border-style: solid;
            border-width: 6px 4px 0 4px;
            border-color: #ffffff transparent transparent transparent;
            content: '';
            height: 0;
            margin-right: 5px;
            width: 0;
          }
        `}</style>
      </section>
    )
  return <div>Loading</div>
}

export const starships = gql`
  query starships($page: Int) {
    allStarships(page: $page) {
      name
      id
    }
  }
`

export const allPostsQueryVars = {
  page: 1
}

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(starships, {
  options: {
    variables: allPostsQueryVars
  },
  props: ({ data }) => {
    return ({
      data,
      loadMorePosts: () => {
        const page = allPostsQueryVars.page + 1
        return data.fetchMore({
          variables: {
            page
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult
            }

            allPostsQueryVars.page = page

            return (Object.assign({}, previousResult, {
              // Append the new posts results to the old one
              allStarships: [...previousResult.allStarships, ...fetchMoreResult.allStarships]
            }))
          }
        })
      }
    })
  }
})(PostList)
