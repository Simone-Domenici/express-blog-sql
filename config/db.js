const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Domenici00.',
    database: 'db_posts'
});

connection.connect((err) => {
    if (err) throw ('Error connecting to the database:', err)
        
    console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;