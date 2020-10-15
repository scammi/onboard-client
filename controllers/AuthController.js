let bcrypt = require('bcrypt');
let db = require('./DbController.js') 

class AuthController
{
  static async checkUser(req, res) 
  {
    let username = req.body.username;
    let password = req.body.password;
    let query = 'SELECT * FROM accounts WHERE username = ? AND password = ?';
    let connection = db.create_connection()

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

    // const match = await bcrypt.compare(password, user.passwordHash);

    // if(match) {
    //     //login
    // }

    // //...
  }
}

module.exports = AuthController;
