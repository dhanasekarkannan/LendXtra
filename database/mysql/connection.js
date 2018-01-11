const mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit : 100,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'lend',
    debug : false
});

module.exports = connection;

module.exports.databaseName = (data) => {
    return 'lend';
}
