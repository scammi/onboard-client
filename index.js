var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var path = require('path');
var mysql = require('mysql');

import { nextTick } from 'process';
import Onboard from './onboard/OnboardService.js';

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* 
  ROUTING
*/

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.get('/user_home', async (req, res) => {
  let user_authenticated = req.session.loggedin;
  if (user_authenticated) res.sendFile(path.join(__dirname + '/views/user_home.html'))
});

app.get('/create_user', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/create_user.html'))
});

app.post('/auth', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let query = 'SELECT * FROM accounts WHERE username = ? AND password = ?';

  if (username && password) {
    connection.query(query, [username, password], function (error, results, fields) {
      if (results.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        req.session.address = results[0].address;
        res.redirect('/user_home');

      } else {
        res.send('Incorrect Username and/or Password!');
      }
    });
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});

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
  let origin_addres = req.session.address;
  let destination_address = req.body.destination_address;
  let amount = req.body.trnasaction_amount;

  let onboard = new Onboard();
  let txReceipt = await onboard.create_transaction(origin_addres, destination_address, amount)
    .catch((err) => { next(err)});
  // console.log(txReceipt)
})

app.listen(3000);
console.log('listening on port 3000')