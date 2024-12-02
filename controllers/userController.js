import {
  registerUserInDB,
  getUserFromDB,
  getUserDetails,
  getMeterfromNumber,
  getReadingByUserID,
  getUserForLogin,
  restoreUserInDB
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
} = constant.messages;

const { SUCCESS, BAD_REQUEST, NOT_FOUND, CREATED, ER_DUP_ENTRY } =
  constant.codes;

const registerUser = async (req, res) => {
  try {
    const { name, email, password, contact, city, address} = req.body;

    const userExits = await getUserFromDB(email);
       
    if (userExits.length > 0) {
      
      const existingUser = userExits[0];
      if (existingUser.is_deleted == 1) {
      
        const hashedPassword = await bcrypt.hash(password, 10);
        const restoreUserResult = await restoreUserInDB(
          existingUser.id,
          name,
          email,
          hashedPassword,
          contact,
          city,
          address,existingUser.created_by
        );
        if (!restoreUserResult) {
          throw errorHandler(ERROR_IN_REGISTER, BAD_REQUEST);
        }

        return res.status(200).json({
          message: REGISTER_SUCESS,
          user: {
            name,
            email,
            contact,
            city,
            address
          },
        });
      }

      throw errorHandler(USER_ALREADY_EXIT, BAD_REQUEST);
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const registerUser = await registerUserInDB(
      name,
      email,
      hashedPassword,
      contact,
      city,
      address
    );

    if (!registerUser) {
      throw errorHandler(ERROR_IN_REGISTER, BAD_REQUEST);
    }

    res.status(CREATED).json({
      message: REGISTER_SUCESS,
      user: {
        name,
        email,
        contact,
        city,
        address
      },
    });
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

    res.status(SUCCESS).json({
      message: LOGIN_SUCESS,
      token,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const profileUser = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const {meter_number} = req.params;

    const [user] = await getUserDetails(userId);

    if (!user) {
      throw errorHandler(USER_NOT_FOUND, NOT_FOUND);
    }

    const [meter] = await getMeterfromNumber(meter_number);

     
    if (!meter) {
      throw errorHandler(METER_NOT_FOUND, NOT_FOUND);
    }

    const readings = await getReadingByUserID(meter.id);

    res.status(SUCCESS).json({
      message: USER_PROFILE,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        address: user.address,
        role_id: user.role_id,
        meter_number: meter.meter_number,
        readings: readings,
      },
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export { registerUser, loginUser, profileUser };
