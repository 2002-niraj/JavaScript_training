
import { errorHandler,sendErrorResponse } from "../helper/helper.js"
import {  getAllUserFromDB,updateUserInDB,getUserByIdFromDB ,deleteEventFromDB,changeRoleInDB} from '../models/adminModel.js'
import bcrypt from 'bcrypt';
import { getUserFromDB ,getMeterNumberFromDB,addInMeter,registerUserInDB} from "../models/userModel.js";

const getAllusers = async(req,res)=>{
        
    try{
        const role_id = req.user.role_id; 

        if(role_id == 3){
            throw errorHandler("access denied!", 404);
        }
         const userData = await getAllUserFromDB();
         if (!userData.length) {
            throw errorHandler("userdata not found!", 404);
          }
          res.status(200).json(userData); 
    }
    catch(error){
        sendErrorResponse(res,error);
    }
}

const createUser = async(req,res)=>{
     
    try{

        const role_id = req.user.role_id; 
        if(role_id == 3){
            throw errorHandler("access denied!", 404);
        }
        
        const {name,email,password,contact,city,address,meter_number} = req.body;

        const userExits = await getUserFromDB(email);

        if(userExits.length>0){
           throw errorHandler("User already exit please login",400);
        };

        const meterExits = await getMeterNumberFromDB(meter_number)
        if(meterExits.length>0){
            throw errorHandler("meter number already registered",400);
        }

        const meterResult = await addInMeter(meter_number,email);
        if(!meterResult){
            throw errorHandler("error in registering meter",400);
        }

        const meter_id = meterResult.insertId

        const hashedPassword = await bcrypt.hash(password,10);
        const registerUser = await registerUserInDB(name,email,hashedPassword,contact,city,address,meter_id);

        if (!registerUser) {
            throw errorHandler("error in registeration", 400);
        }


        res.status(201).json({
            message:"user Registered sucessfully",
            user:{
                name,email,contact,city,address,meter_number
            }
        });

    }
    catch(error){
        sendErrorResponse(res,error);
    }
}


const updateUser = async(req,res)=>{
      
    try{
 

        

    }
    catch(error){
   
    }

}

const deleteUser = async(req,res)=>{

    try{

        const role_id = req.user.role_id; 
        if(role_id == 3){
            throw errorHandler("access denied!", 404);
        }
        

        const { id } = req.params;

        if (isNaN(Number(id))) {
          throw errorHandler("invaild id", 400);
        }
    
        const userExits = await getUserByIdFromDB(id);
        if (!userExits.length) {
          throw errorHandler("user not found", 404);
        }

       const role_id_DB = userExits[0].role_id;

       if(role_id_DB == 1){
        throw errorHandler("access denied you can't delete superadmin", 404);
       }


        const userData = await deleteEventFromDB(id);

        if (userData.affectedRows > 0) {
            res.status(200).send({ message:"user deleted sucessfully"});
          } else {
            throw errorHandler("user not found", 404);
        }

        
    }
    catch(error){
         sendErrorResponse(res,error);
    }

}

const changeUserRole = async(req,res)=>{
      try{
        
        const role_id_token = req.user.role_id; 
        if(role_id_token == 3 || role_id_token == 2){
            throw errorHandler("access denied!", 404);
        }

        const { id } = req.params;
        const {role_id} = req.body;
        
        const userExits = await getUserByIdFromDB(id);
        if (!userExits.length) {
          throw errorHandler("user not found", 404);
        }

        const changeRole = await changeRoleInDB(id,role_id);
        
        if (changeRole.affectedRows > 0) {
            res.status(200).send({ message:"role changed sucessfully"});
          } else {
            throw errorHandler("user not found", 404);
        }

        
      }
      catch(error){
        sendErrorResponse(res,error);
      }
}

const getAllMeterRecord = async(req,res)=>{

}
const createMeterRecord = async(req,res)=>{

}

const updateMeterRecord = async(req,res)=>{

}
const deleteMeterRecord = async(req,res)=>{

}


export {getAllusers,createUser,updateUser,deleteUser,changeUserRole,getAllMeterRecord,createMeterRecord,
    updateMeterRecord,deleteMeterRecord}