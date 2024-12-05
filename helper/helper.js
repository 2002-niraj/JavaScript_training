import db from '../config/dbConnection.js'
import bcrypt from "bcrypt";

import {registerUserInDB,createMeterInDB,userMeterMapping} from '../models/userModel.js'

import constant from "../constant/constant.js";
const {
  ERROR_IN_REGISTER,
  REGISTER_SUCESS,
  ACCOUNT_NOT_EXITS,
  WRONG_PASSWORD,
  LOGIN_SUCESS,
  ER_DUP_ENTRY,
   USER_EXISTS,
  ERROR_IN_METER_RECORD,
  ERROR_IN_USER_METER_MAP
} = constant.messages;


const { SUCCESS, BAD_REQUEST, NOT_FOUND, CREATED ,CONFLICT, INTERNAL_SERVER_ERROR} =
  constant.codes;

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


const isVaildId = (id) => {
  if (!/^\d+$/.test(id)) {
    throw errorHandler("Invalid ID:ID must be positive integer", 400);
  }
};

 const errorHandler = (message,statusCode)=>{
    const error = new Error(message);
    error.statusCode = statusCode
    return error;

 }

 const registerUserAndCreateMeter = async(userDetails,created_by)=>{
    
   const {name,email,password,contact,city,address} = userDetails;
  
   const hashedPassword = await bcrypt.hash(password, 10);
   const registerUser = await registerUserInDB(
     name,
     email,
     hashedPassword,
     contact,
     city,
     address,
     created_by
   );
 
   if (!registerUser) {
     throw errorHandler(ERROR_IN_REGISTER, INTERNAL_SERVER_ERROR );
   }
 
   const meter_number = "M" + [Date.now() + Math.floor(Math.random() * 10)];
 
   const createMeter = await createMeterInDB(meter_number,  created_by);
   if (!createMeter) {
     throw errorHandler(ERROR_IN_METER_RECORD, INTERNAL_SERVER_ERROR);
   }
 
   const userId = registerUser.insertId;
   const meter_id = createMeter.insertId;
 
   const user_meter_map = await userMeterMapping(userId, meter_id, created_by);
   if (!user_meter_map) {
     throw errorHandler(ERROR_IN_USER_METER_MAP,INTERNAL_SERVER_ERROR);
   }
 
   return {
     name,email,contact,city,address,meter_number
   }
   
 }  


 const sendErrorResponse =( res, error)=>{
    res.status(error.statusCode|| 500 ).send({
        message:error.message || "unknown error"
    })
 }

 export {executeQuery,errorHandler,sendErrorResponse,registerUserAndCreateMeter,isVaildId}