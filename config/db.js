const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({ uri: process.env.DB_URL });

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = connection;