var bodyParser = require('body-parser');
var express    = require('express');
var session    = require('express-session');
var path       = require('path');
var mysql      = require('mysql');

import  Onboard  from './onboard/Onboard.js';
import  apiKey   from './onboard/pk.js';

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

app.get('/',  (request, response) => {
  response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/user_home', async (request, response) => {
  let user_authenticated = request.session.loggedin;
  if (user_authenticated) response.sendFile(path.join(__dirname + '/user_home.html'))
});

app.get('/create_user', (request, response) => {
  response.sendFile(path.join(__dirname + '/create_user.html'))
});

app.post('/auth', (request, response) => {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
    connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
      if (results.length > 0) {
        request.session.loggedin = true;
        request.session.username = username;
        request.session.address = results[0].address; 
        response.redirect('/user_home');

      } else {
        response.send('Incorrect Username and/or Password!');
      }
    });
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});

app.post('/create_user', async(request, response) => {
  let onboard = new Onboard(apiKey);

  let address = await onboard.createUser(); 
  var username = request.body.username;
  var password = request.body.password;
  var todo = [username, password, address];

  if(username && password) {
    connection.query('INSERT INTO accounts (username, password, address) VALUES (?, ?, ?)', todo, (err, res, fields)=> {
      if (err) return console.error(err.message);
      else response.redirect('/');
    })
  }   
});

app.post('/create_transaction', async (request, response) => {
  let onboard = new Onboard(apiKey);
  let origin_addres = request.session.address;
  let destination_address = request.body.destination_address;
  let amount  = request.body.trnasaction_amount;

  let txReceipt = await onboard.create_transaction(origin_addres, destination_address, amount);
  console.log(txReceipt) 
})

app.listen(3000);
console.log('listening on port 3000')