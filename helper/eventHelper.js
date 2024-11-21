const db = require('../config/dbConnection');
require('dotenv').config();


const executeQuery = async (query, parameter =[])=>{
     
    const [data] = await db.promise().query(query,parameter);
    return data;
 }

 module.exports = { executeQuery };