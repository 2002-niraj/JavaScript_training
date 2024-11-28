import db from '../config/dbConnection.js'


const executeQuery = (query, parameter =[])=>{
     
    return new Promise((resolve,reject)=>{

      db.query(query,parameter,(error,result)=>{
         if(error){
            return reject(error);
         }
         resolve(result)
      })
    });
   
   }



 const errorHandler = (message,statusCode)=>{
    const error = new Error(message);
    error.statusCode = statusCode
    return error;

 }

 const sendErrorResponse =( res, error)=>{
    res.status(error.statusCode|| 500 ).send({
        message:error.message || "unknown error"
    })
 }

 export {executeQuery,errorHandler,sendErrorResponse}