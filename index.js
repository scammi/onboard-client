var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var path = require('path');
var Etherscan = require('./services/EtherscanService.js');
var AuthController = require('./controllers/AuthController.js');

import Onboard from './services/OnboardService.js';

var app = express();
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'toor',
  database: 'nodelogin'
});

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* 
  ROUTING
*/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.get('/user_home', Etherscan.get_balance);

app.get('/create_user', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/create_user.html'))
});

app.post('/auth', AuthController.checkUser);

app.post('/create_user', async (req, res) => {
  let onboard = new Onboard();

  let address = await onboard.createUser();
  var username = req.body.username;
  var password = req.body.password;
  var params = [username, password, address];

  if (username && password) {
    connection.query('INSERT INTO accounts (username, password, address) VALUES (?, ?, ?)', params, (query_err, query_res, fields) => {
      if (query_err) return console.error(query_err.message);
      else res.redirect('/');
    })
  }
});

app.post('/create_transaction', async (req, res, next) => {
  let origin_address = req.session.address;
  let destination_address = req.body.destination_address;
  let amount = req.body.transaction_amount;

  let onboard = new Onboard();
  let txReceipt = await onboard.create_transaction(origin_address, destination_address, amount)
    .catch((err) => { next(err) })
    .then(() => {
      console.log('transaction created')
      res.end('{"success" : "Updated Successfully", "status" : 200}');
    })
})

app.listen(3000);
console.log('listening on port 3000')