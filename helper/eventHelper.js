const db = require('../config/dbConnection');
const { messages } = require('../constants/constant');

const executeQuery = async(query, parameter =[])=>{
     
    const [data] = await db.promise().query(query,parameter);
    return data;
 }

 const createError = (message,statusCode)=>{
    const error = new Error(message);
    error.statusCode = statusCode
    return error;

 }

 const sendErrorResponse =( res, error)=>{
    res.status(error.statusCode|| 500 ).send({
        message:error.message
    })
 }

 module.exports = { executeQuery,createError,sendErrorResponse };