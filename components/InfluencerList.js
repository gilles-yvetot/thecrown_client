import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from './ErrorMessage'

const INFLUENCERS_PER_PAGE = 10

function InfluencerList({
  data: { loading, error, allInfluencers, _allInfluencersMeta },
  loadMoreInfluencers
}) {
  if (error) return <ErrorMessage message='Error loading influencers.' />
  if (allInfluencers && !loading) {
    const areMoreInfluencers = allInfluencers.length < _allInfluencersMeta.count
    return (
      <section>
        <div>{allInfluencers.length} influencers</div>
        <ul>
          {allInfluencers.map((influencer, index) => (
            <li key={influencer.id}>
              <div>
                <span>{index + 1}. </span>
                <div>{influencer.name}</div>
              </div>
            </li>
          ))}
        </ul>
        {areMoreInfluencers ? (
          <button onClick={() => loadMoreInfluencers()}>
            {' '}
            {loading ? 'Loading...' : 'Show More'}{' '}
          </button>
        ) : (
            ''
          )}
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
  }
  return <div>Loading</div>
}

export const allInfluencers = gql`
  query allInfluencers($first: Int!, $skip: Int!) {
    allInfluencers(orderBy: createdAt_DESC, first: $first, skip: $skip) {
      id
      name
      price
      picture
      createdAt
      tokenId
    }
    _allInfluencersMeta {
      count
    }
  }
`
export const allInfluencersQueryVars = {
  skip: 0,
  first: INFLUENCERS_PER_PAGE
}

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (InfluencerList)
export default graphql(allInfluencers, {
  options: {
    variables: allInfluencersQueryVars
  },
  props: ({ data }) => {
    return {
      data,
      loadMoreInfluencers: () => {
        return data.fetchMore({
          variables: {
            skip: data.allInfluencers.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult
            }
            return Object.assign({}, previousResult, {
              // Append the new influencers results to the old one
              allInfluencers: [...previousResult.allInfluencers, ...fetchMoreResult.allInfluencers]
            })
          }
        })
      }
    }
  }
})(InfluencerList)
