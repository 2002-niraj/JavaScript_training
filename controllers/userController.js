import {
  registerUserInDB,
  getUserFromDB,
  getUserForLogin,
  restoreUserInDB,
  userMeterMapping,
  getMeterNumber,
  getUserMeterReading,createMeterInDB
} from "../models/userModel.js";
import { errorHandler, sendErrorResponse } from "../helper/helper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import constant from "../constant/constant.js";
const {
  USER_ALREADY_EXIT,
  ERROR_IN_REGISTER,
  REGISTER_SUCESS,
  ACCOUNT_NOT_EXITS,
  WRONG_PASSWORD,
  LOGIN_SUCESS,
  USER_NOT_FOUND,
  USER_PROFILE,
  METER_NOT_FOUND,
  ER_DUP_ENTRY
} = constant.messages;


const { SUCCESS, BAD_REQUEST, NOT_FOUND, CREATED } =
  constant.codes;


const registerUserAndCreateMeter = async(userDetails,created_by)=>{
    
  const {name,email,password,contact,city,address} = userDetails;

  if(created_by == null){
    created_by = email
  }

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
    throw errorHandler(ERROR_IN_REGISTER, BAD_REQUEST);
  }

  const meter_number = "M" + [Date.now() + Math.floor(Math.random() * 10)];

  const createMeter = await createMeterInDB(meter_number,  created_by);
  if (!createMeter) {
    throw errorHandler("error in creating meter record!", 400);
  }

  const userId = registerUser.insertId;
  const meter_id = createMeter.insertId;

  const user_meter_map = await userMeterMapping(userId, meter_id, created_by);
  if (!user_meter_map) {
    throw errorHandler("error in creating user_meter_map");
  }

  return {
    name,email,contact,city,address,meter_number
  }
  
}  

const registerUser = async (req, res) => {
  try {
    const userDetails = req.body;

    //const userExits = await getUserFromDB(email);

    const registerUser = await registerUserAndCreateMeter(userDetails,null);

    res.status(CREATED).json({
      message:REGISTER_SUCESS,
      user:registerUser
    })
    

  } catch (error) {
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(BAD_REQUEST).send({
        message: ER_DUP_ENTRY,
      });
    }

    sendErrorResponse(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await getUserForLogin(email);

    if (!user) {
      throw errorHandler(ACCOUNT_NOT_EXITS, BAD_REQUEST);
    }

    const isVaildPassword = await bcrypt.compare(password, user.password);

    if (!isVaildPassword) {
      throw errorHandler(WRONG_PASSWORD, BAD_REQUEST);
    }
    const token = jwt.sign(
      { user_id: user.id, role_id: user.role_id, email: user.email },
      process.env.SECRETKEY
    );

    const meter_numbers = await getMeterNumber(user.id);

    res.status(SUCCESS).json({
      message: LOGIN_SUCESS,
      userdata: {
        name: user.name,
        email: user.email,
        contact: user.contact,
        city: user.city,
        address: user.address,
        meter_numbers: meter_numbers,
      },
      token,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const userMeterRecord = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { meter_number } = req.params;
  //  console.log(meter_number);

    const allMeterRecord = await getUserMeterReading(userId, meter_number);
    if (!allMeterRecord.length) {
      throw errorHandler("meter reading not exits", 400);
    }

    res.status(200).json({
      message: "Meter readings",
      meter_number: meter_number,
      meter_readings: allMeterRecord,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export { registerUser, loginUser, userMeterRecord ,registerUserAndCreateMeter};
