import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
    ssl: {
        rejectUnauthorized: true,
    },
});

con.connect(function (err) {
    if (err) throw err;
    console.log('Connected!');
});

export default con;
