import {
  getUserDetails,
  getMeterNumber,
  getUserMeterReading
} from "../models/userModel.js";
import { errorHandler, sendErrorResponse,registerUserAndCreateMeter ,isVaildId} from "../helper/helper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import {getUserByIdFromDB} from '../models/adminModel.js';

import constant from "../constant/constant.js";
const {
  REGISTER_SUCESS,
  ACCOUNT_NOT_EXITS,
  WRONG_PASSWORD,
  LOGIN_SUCESS,
  USER_EXISTS,USERDETAILS_NOT_FOUND,USER_PROFILE,METER_READING
} = constant.messages;


const { SUCCESS, NOT_FOUND, CREATED ,CONFLICT,UNAUTHORIZED} =
  constant.codes;


const registerUser = async (req, res) => {
  try {
    const userDetails = req.body;
    const {email} = userDetails

    const userExits = await getUserDetails(email);
    if(userExits.length){
      throw errorHandler( USER_EXISTS,CONFLICT);
    }

    const registerUser = await registerUserAndCreateMeter(userDetails,email);

    res.status(CREATED).json({
      message:REGISTER_SUCESS,
      user:registerUser
    })
    
  } catch (error) {

    sendErrorResponse(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await getUserDetails(email);

    if (!user) {
      throw errorHandler(ACCOUNT_NOT_EXITS, NOT_FOUND);
    }

    const isVaildPassword = await bcrypt.compare(password, user.password);

    if (!isVaildPassword) {
      throw errorHandler(WRONG_PASSWORD, UNAUTHORIZED);
    }
    const token = jwt.sign(
      { user_id: user.id, role_id: user.role_id, email: user.email },
      process.env.SECRETKEY , {expiresIn: '24h'}
    );

    res.status(SUCCESS).json({
      message: LOGIN_SUCESS,
      token,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const userProfile = async(req,res)=>{
  try{
       const {user_id} = req.params;
       isVaildId(user_id);

       const userDetails = await getUserByIdFromDB(user_id);

       if(!userDetails.length){
        throw errorHandler(USERDETAILS_NOT_FOUND,NOT_FOUND);
       }

       const meter_numbers_data = await getMeterNumber(user_id);
       const meter_numbers = meter_numbers_data.map((meter)=>meter.meter_number)


       res.status(SUCCESS).json({
        message:USER_PROFILE,
        userDetails:{...userDetails[0], meter_numbers}
        
       })
  }
  catch(error){
      sendErrorResponse(res,error);
  }

}

const userMeterRecord = async (req, res) => {
  try {

    const userId = req.user.user_id;
    const { meter_number } = req.params;

    const allMeterRecord = await getUserMeterReading(userId, meter_number);

    res.status(SUCCESS).json({
      message: METER_READING,
      meter_number: meter_number,
      meter_readings: allMeterRecord,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};



export { registerUser, loginUser, userMeterRecord ,userProfile};
