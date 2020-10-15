var key = require('./pk.js');
var axios = require('axios');

class Etherscan {
  static async get_balance(req, res) {
    if (req.session.loggedin) {
      let address = req.session.address;

      let token_balance = await axios({
        method: 'get',
        url: 'https://api-goerli.etherscan.io/api',
        params: {
          module: 'account',
          action: 'tokentx',
          address: address,
          tag: 'latest',
          apikey: key.etherscan
        }
      });

      let get_eth_balance = await axios({
        method: 'get',
        url: 'https://api-goerli.etherscan.io/api',
        params: {
          module: 'account',
          action: 'balance',
          address: address,
          tag: 'latest',
          apikey: key.etherscan
        }
      });

      Promise.all([token_balance, get_eth_balance])
        .then(function (results) {

          const token = results[0].data.result[0].value;
          const eth = results[1].data.result;

          console.log("token:", token, eth);
          res.render('user_home', {
            address: address,
            eth_balance: eth,
            token_balance: token
          });
        });
    }
  }
}

module.exports = Etherscan;