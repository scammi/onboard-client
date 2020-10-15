var mysql = require('mysql');

class DbController 
{
  static create_connection() 
  {
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'toor',
      database: 'nodelogin'
    });

    return connection;
  }
}

module.exports = DbController;