var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

import apiKey  from './onboard/pk.js';
import { Onboard } from './onboard/Onboard.js';

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'toor',
	database : 'nodelogin'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', async(request, response)=> {
	if (request.session.loggedin) {
    let onboard = new Onboard(apiKey);
    let balance = await onboard.get_balance().catch((error) => {
        console.log(error);
      });
      
		response.send(`your balance if ${balance}`);
	} else {
    response.send(`ERROR`);
	}
	response.end();
});

app.get('/create_user', function(request, response) {
  response.sendFile(path.join(__dirname + '/create_user.html'))
});

app.post('/create_user', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  var todo = [username, password, 'testcom'];

  if(username && password) {
    connection.query('INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)', todo, (err, res, fields)=> {
      if (err) return console.error(err.message);
      else response.redirect('/');
    })
  }   
});

app.listen(3000);