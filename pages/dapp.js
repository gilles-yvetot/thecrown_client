import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'

class Dapp extends React.Component {
  state = {
    ceoAddress: null,
    ethBalance: null,
  }

  getCEOaddress = async () => {
    const { accounts, contract } = this.props
    const response = await contract.ceoAddress.call({})
    this.setState({ ceoAddress: response })
  }

  getEthBalance = async () => {
    const { web3, accounts } = this.props
    const balanceInWei = await web3.eth.getBalance(accounts[0])
    this.setState({ ethBalance: balanceInWei / 1e18 })
  }

  render() {
    const { ceoAddress = 'N/A', ethBalance = "N/A" } = this.state
    return (
      <div>
        <h1>My Dapp</h1>

        <button onClick={this.getCEOaddress}>Get CEO address</button>
        <button onClick={this.getEthBalance}>Get ether balance</button>
        <div>CEO Address {ceoAddress}</div>
        <div>Ether Balance: {ethBalance}</div>
        <div><Link href='/accounts'><a>My Accounts</a></Link></div>
        <div><Link href='/'><a>Home</a></Link></div>
      </div>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, contract }) => (
      <Dapp accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
