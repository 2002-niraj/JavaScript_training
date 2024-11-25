const mysql = require("mysql2");

require('dotenv').config();
 
const {DB_HOST,DB_USER,DB_PASSWORD,DB_NAME } = process.env
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password:DB_PASSWORD,
  database:DB_NAME,
  waitForConnections:true,
  connectionLimit:10,
  queueLimit:0
});

pool.getConnection((error,connection)=>{

  if(error){
    console.error("Database connection failed:", err.message);
  }
  console.log("Connected to the MySQL database");
  connection.release();
})

module.exports = pool;

