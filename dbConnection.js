const mysql = require("mysql2");
require('dotenv').config();


const connection = mysql.createConnection({
  host: process.env.dB_HOST,
  user: process.env.dB_USER,
  password: process.env.dB_PASSWORD,
  database: process.env.dB_NAME
});

connection.connect((error) => {
  if (error) {
    console.error("Database connection failed:", err.message);
   return;
  }
  console.log("Connected to the MySQL database");
});

module.exports = connection;