import { registerUserInDB,getUserFromDB,getUserDetails ,addInMeter,getMeterNumberFromDB,getMeterNumberFromID,getReadingByUserID} from "../models/userModel.js";
import { createError,sendErrorResponse } from "../helper/helper.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = async(req,res)=>{

 
    try{
        const {name,email,password,contact,city,address,meter_number} = req.body;

        console.log(req.body);

        const created_by = email ;
        const updated_by = email ;

        const userExits = await getUserFromDB(email);

        if(userExits.length>0){
           throw createError("User already exit please login",400);
        };

        const meterExits = await getMeterNumberFromDB(meter_number)
        if(meterExits.length>0){
            throw createError("meter number already registered",400);
        }

        const meterResult = await addInMeter(meter_number,created_by,updated_by);
        if(!meterResult){
            throw createError("error in registering meter",400);
        }

        const meter_id = meterResult.insertId

        const hashedPassword = await bcrypt.hash(password,10);
        const registerUser = await registerUserInDB(name,email,hashedPassword,contact,city,address,meter_id,created_by,updated_by);

        if (!registerUser) {
            throw createError("error in registeration", 400);
        }

        res.status(201).json({
            message:"user Registered sucessfully",
            user:{
                name,email,contact,city,address,meter_number
            }
        })
    }
    catch(error){
           sendErrorResponse(res,error);
    }

}

const loginUser = async(req,res)=>{

  try{
    const {email,password} = req.body;
   
    const [user] = await getUserFromDB(email);

    if(!user){
        throw createError("account not found please register",400);
    }

    const isVaildPassword = await bcrypt.compare(password,user.password);

    if(!isVaildPassword){
        throw createError("wrong passoword",400);
    }
    const token = jwt.sign({user_id:user.id,role_id:user.role_id},process.env.SECRETKEY);

    res.status(200).json({
        message:"user login successfully",
        token
    })

  }
  catch(error){

    sendErrorResponse(res,error);

  }
}

const profileUser = async(req,res)=>{
      
   try{
    
     const userId = req.user.user_id; 

     const [user] = await getUserDetails(userId);

     if(!user){
        throw createError("user not found",404);
     }

  
     const [meter] = await getMeterNumberFromID(user.meter_id);
      if(!meter){
        throw createError("meter not found for user",404);
      } 

      const readings = await getReadingByUserID(userId);

      console.log(readings);

    //   const readingArray = readings.map((reading)=>({
    //     reading_date:reading.reading_date,
    //     reading_value:reading.reading_value
    //   }));

      res.status(200).json({
        message:"user profile",
        data:{
            id:user.id,
            name:user.name,
            email:user.email,
            city:user.city,
            address:user.address,
            role_id:user.role_id,
            meter_number:meter.meter_number,
            readings:readings
        }
      })

   }
   catch(error){
       sendErrorResponse(res,error);
   }
}


export {registerUser,loginUser,profileUser};