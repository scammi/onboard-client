
import { App } from '@onboardmoney/sdk';
import onboard_apiKey  from './pk.js';

export default class Onboard {

  constructor() {
    const network = 'goerli';
    this.apikey = apiKey;
    this.address = '0x711D96a560f72A048bDc64D87526249a82aB5D02';
    this.onboardmoney = new App(this.onboard_apiKey, `https://${network}.onboard.money`);
  }

  async get_balance() {
    // Fetch application ETH balance and address for gas payments
    const { balance, relayAddress } = await this.onboardmoney.balance()
    .catch((error) => {
      console.log(error);
    });
    console.log(balance);
    return balance;
  }

  async createUser() {
    const { userAddress } = await this.onboardmoney.createUser().catch((error) => {
      console.log(error);
    });
    console.log(userAddress);
    return userAddress;
  }

  async get_policy() {
    const { policy } = await this.onboardmoney.getPolicy();
    console.log(policy);
  }

  async create_transaction(user_address, destination_address, value) {
    const batch = {
      txs: [
        {
          from: user_address,
          to: destination_address,
          value: value,
        },
      ],
    }
    console.log('creating transaction')
    const txReceipt = await this.onboardmoney.sendBatch(batch); 
    
    return txReceipt;
  }
  async evaluateBatch() {
    const userAddress = '0xdCD3a7aEf5994b731Cc90395894fD4475dD6AdFd'
    const batch = {
      txs: [
        {
          from: userAddress,
          to: '0x5b2554112Ce698B023CC7fF4EB27eAd0e3fad019',
          value: 5000000000000000,
          gasLimit: '100000',
        },
      ],
    }
    const { success } = await this.onboardmoney.evaluateBatch(batch)
  }
}


// balance().catch((error) => {
//   console.log(error);
// });

// createUser().catch((error) => {
//   console.log(error);
// });

// get_policy().catch((error) => {
//   console.log(error);
// })

// createTrx().catch((error) => {
//   console.log(error);
// })

// evaluateBatch().catch((error) => {
//   console.log(error);
// })