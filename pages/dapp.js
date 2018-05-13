import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import web3 from 'web3'

class Dapp extends React.Component {
  state = {
    ethBalance: null,
    response: null,
    crownBalance: null,
    tokenInpt: 0,
    accounts: []
  }

  componentWillMount = () => {
    this.props.getAccounts()
      .then(accounts => this.setState({ accounts }))
  }

  buyTokens = async () => {
    const { tokenInpt, accounts } = this.state
    if (tokenInpt) {
      const { saleContract } = this.props
      if (accounts.length) {
        saleContract.buyTokens(
          accounts[0],
          { _beneficiary: accounts[0] },
          {
            from: accounts[0],
            value: web3.utils.toWei('0.1', 'ether'),
          }
        )
          .then(response => {
            console.log('response', response);
          })
          .catch(err => {
            if (err.message.indexOf(`User denied Transaction`)) {
              alert(`It looks like you deny the transaction`)
            }
          })
      }
    }
  }

  getEthBalance = async () => {
    const { web3 } = this.props
    const { accounts } = this.state
    const balanceInWei = await web3.eth.getBalance(accounts[0])
    this.setState({ ethBalance: balanceInWei / 1e18 })
  }

  getCrownBalance = async () => {
    const { tokenContract } = this.props
    const { accounts } = this.state
    const balanceInWei = await tokenContract.balanceOf.call(accounts[0], { from: accounts[0] })
    this.setState({ crownBalance: balanceInWei / 1e18 })
  }

  render() {

    const { ethBalance = "N/A", crownBalance, tokenInpt, accounts } = this.state

    return (
      <div>
        <h1>My Dapp</h1>
        {accounts && !!accounts.length && (
          <div>
            <div>
              <button disabled={!tokenInpt} onClick={this.buyTokens}>Buy Crown Tokens</button>
              <span>How many ether?</span>
              <input
                type="number"
                value={tokenInpt}
                min="0"
                onChange={({ target: { value } }) => this.setState({ tokenInpt: value })}
              />
              <span>{(tokenInpt || 0) * 1000} crown tokens</span>
            </div>

            <div>
              <button onClick={this.getCrownBalance}>Get crown balance</button>
              <div>Crown Balance: {crownBalance}</div>
            </div>

            <div>
              <button onClick={this.getEthBalance}>Get ether balance</button>
              <div>Ether Balance: {ethBalance}</div>
            </div>
          </div>
        )}

        {(!accounts || !accounts.length) && (
          <div>
            No account detected
          </div>
        )}


        <div><Link href='/accounts'><a>My Accounts</a></Link></div>
        <div><Link href='/'><a>Home</a></Link></div>
      </div>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ getAccounts, tokenContract, saleContract, web3 }) => (
      <Dapp
        getAccounts={getAccounts}
        tokenContract={tokenContract}
        saleContract={saleContract}
        web3={web3}
      />
    )}
  />
)
