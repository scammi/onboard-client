import Onboard from '../services/OnboardService.js';
let bcrypt = require('bcrypt');
let db = require('./DbController.js')

class AuthController {
  static async checkUser(req, res) {
    let username = req.body.username;
    let PlaintextPassword = req.body.password;
    let query = 'SELECT * FROM accounts WHERE username = ?';
    let connection = db.create_connection();

    console.log('trying to log you in');

    if (username && PlaintextPassword) {
      connection.query(query, [username], function (error, results, fields) {
        if (results.length > 0) {

          console.log(results);
          let hash = results[0].password;

          bcrypt.compare(PlaintextPassword, hash, function (err, result) {
            if (result == true) {
              console.log('loging in')
              req.session.loggedin = true;
              req.session.username = username;
              req.session.address = results[0].address;
              res.redirect('/user_home');
            }
          });
        } else {
          res.send('Incorrect Username and/or Password!');
        }
      });
    } else {
      res.send('Please enter Username and Password!');
      res.end();
    }
  }

  static async createUser(req, res) {
    let onboard = new Onboard();
    let connection = db.create_connection();

    var username = req.body.username;
    var password = req.body.password;

    let query = 'SELECT * FROM accounts WHERE username = ?';

    connection.query(query, [username], function (query_err, query_res, fields) {
      if (query_res.length > 0) {
        
        res.send('Incorrect Username and/or Password!');

      }
    }) 
    
    let address = await onboard.createUser();

    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
      let params = [username, bcryptedPassword, address];

      if (username && password) {
        connection.query('INSERT INTO accounts (username, password, address) VALUES (?, ?, ?)', params, (query_err, query_res, fields) => {
          if (query_err) return console.error(query_err.message);
          else res.end('{"success" : "Updated Successfully", "status" : 200}');
        })
      }
    });

  }

  static async user_exists () {
    return new Promise((resolve, reject) => {
     db.query('SELECT * FROM accounts WHERE username = ?', (err) => {
      if (err) {
       return reject(err)
      }
      return resolve()
     })
    })
   }
}

module.exports = AuthController;
