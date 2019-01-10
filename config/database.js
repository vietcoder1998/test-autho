const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    connectTimeout: 3000,
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'tradainfor'
});

function getConnection() {
    return pool
}

const connection = getConnection();

module.exports = connection;
