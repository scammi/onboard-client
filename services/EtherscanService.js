import etherscan_apiKey from './pk.js';
import { response } from 'express';
var axios = require('axios');

export default class Etherscan {

  static get_eth_balance(address) {
    axios({
      method: 'post',
      url: 'https://api-goerli.etherscan.io/api',
      data: {
        module: 'account',
        action: 'balance',
        address: address,
        tag: 'latest',
        apikey: etherscan_apiKey
      }
    }).then((response) => {return response})
  }
} 