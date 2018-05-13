import React from 'react'
import getWeb3 from './getWeb3'
import fetchAccounts from './getAccounts'
import getContract from './getContract'
import saleContractDefinition from './contracts/CrownTokenCrowdsale.json'
import tokenContractDefinition from './contracts/CrownToken.json'

export default class Web3Container extends React.Component {
  state = { web3: null, getAccounts: null, saleContract: null, tokenContract: null }

  async componentDidMount() {
    try {
      const web3 = await getWeb3()
      const getAccounts = () => fetchAccounts(web3)
      const saleContract = await getContract(web3, saleContractDefinition)
      const tokenContract = await getContract(web3, tokenContractDefinition)
      this.setState({ web3, saleContract, tokenContract, getAccounts })
    }
    catch (error) {
      alert(`Failed to load web3, accounts, or saleContract. Check console for details.`)
      console.log(error)
    }
  }

  render() {
    const { web3, getAccounts, saleContract, tokenContract } = this.state
    return web3
      ? this.props.render({ web3, getAccounts, saleContract, tokenContract })
      : this.props.renderLoading()
  }
}
