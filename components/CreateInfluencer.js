
import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { allInfluencers, allInfluencersQueryVars } from './InfluencerList'


class CreateInfluencer extends React.Component {

  createInfluencerOnTheBlockChain = (name, picture, price) => {
  }

  handleSubmit = (event) => {
    event.preventDefault()

    // const form = event.target

    // const formData = new window.FormData(form)
    // this.props.createInfluencer(
    //   formData.get('name'),
    //   formData.get('picture'),
    //   parseFloat(formData.get('price'))
    // )
    // form.reset()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} >
        <h1>Create Influencer</h1>
        <input placeholder='name' name='name' type='text' required />
        <input placeholder='picture' name='picture' type='url' required />
        <input placeholder='price' name='price' type='number' required min='1' />
        <button type='submit'>Create</button>
        <style jsx>{`
        form {
          border-bottom: 1px solid #ececec;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 20px;
        }
        input {
          display: block;
          margin-bottom: 10px;
        }
      `}</style>
      </form>
    )
  }
}

const createInfluencer = gql`
  mutation createInfluencer($name: String!,  $price: Float!, $picture: String!){
    createInfluencer(name: $name,  price: $price, picture: $picture){
      id
      name
      price
      picture
      createdAt
      tokenId
    }
  }
`

CreateInfluencer = graphql(createInfluencer, {
  props: ({ mutate }) => ({
    createInfluencer: (name, picture, price) =>
      // `mutate` to tell Apollo Client that you’d like to trigger a mutation
      //  The mutate function optionally takes variables, optimisticResponse, refetchQueries, and update
      mutate({
        variables: { name, picture, price },
        // proxy is actually Apollo cache. The cache has several utility functions such as cache.readQuery and 
        // cache.writeQuery that allow you to read and write queries to the cache with GraphQL as if it were a server. 
        // There are other cache methods, such as cache.readFragment, cache.writeFragment, and cache.writeData
        // The second argument to the update function is an object with a data property containing your mutation result
        update: (proxy, { data: { createInfluencer } }) => {
          const data = proxy.readQuery({
            query: allInfluencers,
            variables: allInfluencersQueryVars
          })
          proxy.writeQuery({
            query: allInfluencers,
            data: {
              ...data,
              allInfluencers: [createInfluencer, ...data.allInfluencers]
            },
            variables: allInfluencersQueryVars
          })
        }
      })
  })
})(CreateInfluencer)

export default CreateInfluencer