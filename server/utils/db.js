const mysql = require("mysql2")
require("dotenv").config()

const {
    MYSQL_DATABASE_HOST,
    MYSQL_DATABASE_USER,
    MYSQL_DATABASE_PASSWORD,
    MYSQL_DATABASE_DATABASE
    } = process.env;

try{
    const pool = mysql.createPool({
        host : MYSQL_DATABASE_HOST,
        user : MYSQL_DATABASE_USER,
        password : MYSQL_DATABASE_PASSWORD,
        database : MYSQL_DATABASE_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    })
    module.exports = pool.promise();
    
}catch(err){
    console.error("DB connection failed")
    console.warn(err.message)
}