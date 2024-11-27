import { registerUserInDB,getUserFromDB,getUserDetails } from "../models/userModel.js";
import { createError,sendErrorResponse } from "../helper/helper.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = async(req,res)=>{

 
    try{
        const {name,email,password,contact,city} = req.body;

        const userExits = await getUserFromDB(email);

        if(userExits.length>0){
           throw createError("User already exit please login",400);
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const registerUser = await registerUserInDB(name,email,hashedPassword,contact,city);

        if (!registerUser) {
            throw createError("error in registeration", 400);
        }

        res.status(201).json({
            message:"user Registered sucessfully",
            user:{
                name,email,contact,city
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
    
    jwt.verify(req.token,process.env.SECRETKEY,async(error,payLoad)=>{
        if(error){
            throw createError("invaild token",400)
         };
       
         console.log(payLoad.user_id);

         const userProfile = await getUserDetails(payLoad.user_id);

         console.log(userProfile);

         res.status(200).json({
            message:"user profile",
            userProfile
         })


     });

     
   }
   catch(error){
       sendErrorResponse(res,error);
   }
}


export {registerUser,loginUser,profileUser};