import { errorHandler, sendErrorResponse } from "../helper/helper.js";
import {
  getAllUserFromDB,
  updateUserInDB,
  getUserByIdFromDB,
  deleteEventFromDB,
  changeRoleInDB,
  getMeterRecordFromDB,
  createMeterRecordInDB,
  updateMeterRecordInDB,
  deleteReadingFromDB,
  getreadingByIdFromDB,
  meterExitsInDB,
} from "../models/adminModel.js";
import bcrypt from "bcrypt";
import {
  getUserFromDB,
  registerUserInDB,
  restoreUserInDB,createMeterInDB,userMeterMapping
} from "../models/userModel.js";

import {registerUserAndCreateMeter} from '../controllers/userController.js'

import constant from "../constant/constant.js";
import { vaildateCreateMeterRecord } from "../middleware/meterRecordVaildation.js";
import csvParser from "csv-parser";
import { Readable } from "stream";

const { SUCCESS, BAD_REQUEST, NOT_FOUND, CREATED, ER_DUP_ENTRY } =
  constant.codes;
const { USER_ALREADY_EXIT, ERROR_IN_REGISTER, REGISTER_SUCESS } =
  constant.messages;

const checkAccess = (role_id) => {
  if (role_id == 3) {
    throw errorHandler("Access denied!", BAD_REQUEST);
  }
};

const isVaildId = (id) => {
  if (isNaN(Number(id))) {
    throw errorHandler("invaild id", 400);
  }
};

const getAllusers = async (req, res) => {
  try {
    checkAccess(req.user.role_id);
    const userData = await getAllUserFromDB();
    if (!userData.length) {
      throw errorHandler("userdata not found!", NOT_FOUND);
    }
    res.status(SUCCESS).json(userData);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const createUser = async (req, res) => {
  try {
    checkAccess(req.user.role_id);
    const created_by = req.user.email;

    const userDetails = req.body;

    //const userExits = await getUserFromDB(email);
     
    const registerUserByAdmin = await registerUserAndCreateMeter(userDetails,created_by);

    res.status(CREATED).json({
      message:REGISTER_SUCESS,
      user:registerUserByAdmin
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


const createMeter = async(req,res)=>{

   try{

    checkAccess(req.user.role_id);
    const created_by = req.user.email;

    const { user_id } = req.body;

    isVaildId(user_id );

  const userExit = await getUserByIdFromDB(user_id);
  if(!userExit.length){
    throw errorHandler("user not exits, check again!",404);
  }
    
  const meter_number = "M" + [Date.now() + Math.floor(Math.random() * 10)];

  const createMeter = await createMeterInDB(meter_number,  created_by);
  if (!createMeter) {
    throw errorHandler("error in creating meter record!", 400);
  }

  const meter_id = createMeter.insertId;

  const user_meter_map = await userMeterMapping(user_id, meter_id, created_by);
  if (!user_meter_map) {
    throw errorHandler("error in creating user_meter_map");
  }

  res.status(CREATED).json({
    message:"meter number created sucessfully",
    userData:{
       ...userExit,
       meter_number:meter_number
    }
  })

   }
   catch(error){

    if (error.code == "ER_DUP_ENTRY") {
      return res.status(BAD_REQUEST).send({
        message: ER_DUP_ENTRY,
      });
    }

    sendErrorResponse(res, error);

   }

}

const updateUser = async (req, res) => {
  try {
    checkAccess(req.user.role_id);
    const updated_by = req.user.email;

    const { id } = req.params;
    const { name, email, contact, city, address } = req.body;

    isVaildId(id);

    const dataExits = await getUserByIdFromDB(id);
    if (!dataExits.length) {
      throw errorHandler("user not found", 404);
    }

    const updateUser = await updateUserInDB(
      name,
      email,
      contact,
      city,
      address,
      updated_by,
      id
    );

    if (updateUser.affectedRows > 0) {
      res.status(SUCCESS).send({ message: "user updated sucessfully" });
    } else {
      throw errorHandler("user not found", NOT_FOUND);
    }
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(BAD_REQUEST).send({
        message: ER_DUP_ENTRY,
      });
    }
    sendErrorResponse(res, error);
  }

};

const deleteUser = async (req, res) => {
  try {

    checkAccess(req.user.role_id);

    const { id } = req.params;

    isVaildId(id);

    const userExits = await getUserByIdFromDB(id);
    if (!userExits.length) {
      throw errorHandler("user not found", 404);
    }

    const role_id_DB = userExits[0].role_id;

    if (role_id_DB == 1) {
      throw errorHandler("access denied you can't delete superadmin", 404);
    }

    const userData = await deleteEventFromDB(id);

    if (userData.affectedRows > 0) {
      res.status(SUCCESS).send({ message: "user deleted sucessfully" });
    } else {
      throw errorHandler("user not found", 404);
    }


  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const changeUserRole = async (req, res) => {
  try {
    const role_id_token = req.user.role_id;

    if (role_id_token == 3 || role_id_token == 2) {
      throw errorHandler(
        "access denied only super admin can change the role",
        BAD_REQUEST
      );
    }

    const { id } = req.params;
    const { role_id } = req.body;

    isVaildId(id);

    const userExits = await getUserByIdFromDB(id);
    if (!userExits.length) {
      throw errorHandler("user not found", 404);
    }

    const changeRole = await changeRoleInDB(id, role_id);

    if (changeRole.affectedRows > 0) {
      res.status(SUCCESS).send({ message: "role changed sucessfully" });
    } else {
      throw errorHandler("user not found", NOT_FOUND);
    }
  } catch (error) {

    if (error.code == "ER_NO_REFERENCED_ROW_2") {
      return res.status(BAD_REQUEST).send({
        message: "role not exits,check again!",
    });
  } else{
    sendErrorResponse(res, error);
  }

  }
};  

const getAllMeterRecord = async (req, res) => {
  try {

    checkAccess(req.user.role_id);

    const meterRecords = await getMeterRecordFromDB();
    if (!meterRecords.length) {
      throw errorHandler("meterrecord not found!", 404);
    }
    res.status(SUCCESS).json(meterRecords);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const storeMeterRecord = async (
  res,
  user_id,
  meter_id,
  reading_value,
  reading_date,
  email
) => {
  try {

    const createMeterRecord = await createMeterRecordInDB(
      user_id,
      meter_id,
      reading_value,
      reading_date,
      email
    );

    if (!createMeterRecord) {
      throw errorHandler("error in storing meterRecord", 404);
    }

    return res.status(SUCCESS).json({
      message: "meterRecord created sucessfully",
      meterRecord: {
        user_id,
        meter_id,
        reading_value,
        reading_date,
      },
    });
  } catch (error) {

    if (error.code == "ER_DUP_ENTRY") {
      return res.status(BAD_REQUEST).send({
        message: "record already exits",
      });
    } else if (error.code == "ER_NO_REFERENCED_ROW_2") {
      return res.status(BAD_REQUEST).send({
        message: "user_id is not exits",
      });
    } else {
      sendErrorResponse(res, error);
    }

  }
};

// const storeMeterRecordViaFile = async(
//   res,
//   user_id,
//   meter_id,
//   reading_value,
//   reading_date,
//   email
// ) => {

//       try{

//         const createMeterRecord = await createMeterRecordInDB(
//           user_id,
//           meter_id,
//           reading_value,
//           reading_date,
//           email
//         );  
//         if (!createMeterRecord) {
//           throw errorHandler("error in storing meterRecord", 404);
//         }

//       }
//       catch(error){
           
//         if (error.code == "ER_DUP_ENTRY") {
//           return res.status(BAD_REQUEST).send({
//             message: "record already exits",
//           });
//         } else if (error.code == "ER_NO_REFERENCED_ROW_2") {
//           return res.status(BAD_REQUEST).send({
//             message: "user_id is not exits",
//           });
//         } else {
//           sendErrorResponse(res, error);
//         }

//       }
// };

const createMeterRecord = async (req, res) => {
  try {
    checkAccess(req.user.role_id);

    const { user_id, meter_number, reading_value, reading_date } = req.body;
      
    const meterExits = await meterExitsInDB(meter_number);

    if (!meterExits.length) {
      const createMeter = await createMeterInDB(meter_number, req.user.email);
      if (!createMeter) {
        throw errorHandler("error in storing meter number", 404);
     }
      const meter_id = createMeter.insertId;
      storeMeterRecord(
        res,
        user_id,
        meter_id,
        reading_value,
        reading_date,
        req.user.email
      );
    } else if (meterExits[0].user_id == user_id) {
      const meter_id = meterExits[0].meter_id;
      storeMeterRecord(
        res,
        user_id,
        meter_id,
        reading_value,
        reading_date,
        req.user.email
      );
    } else {
      throw errorHandler("meter number already exits of another user", 400);
    }
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(BAD_REQUEST).send({
        message: "record already exits",
      });
    } else if (error.code == "ER_NO_REFERENCED_ROW_2") {
      return res.status(BAD_REQUEST).send({
        message: "user_id is not exits",
      });
    } else {
      sendErrorResponse(res, error);
    }
  }
};

// const insertFileRecord = async (req, res, rows,email) => {
//   try {
//     for (const row of rows) {
//       const { user_id, meter_number, reading_value, reading_date } = row;
      
      
//        const meterExits = await meterExitsInDB(meter_number);

//       if (!meterExits.length) {

//         const createMeter = await createMeterInDB(meter_number, email);
//         if (!createMeter) {
//           throw errorHandler("error in storing meter number", 404);
//         }
//         const meter_id = createMeter.insertId;
//        await storeMeterRecordViaFile(
//           res,
//           user_id,
//           meter_id,
//          reading_value,
//          reading_date,
//           email
//         );
//       } else if (meterExits[0].user_id == user_id) {
//         const meter_id = meterExits[0].meter_id;
//         console.log(meter_id);
//         await storeMeterRecordViaFile(
//           res,
//           user_id,
//           meter_id,
//           reading_value,
//           reading_date,
//           email
//         );
//       } 
//       else {
//         throw errorHandler("meter number already exits of another user", 400);
//       }

//     }
//   } catch (error) {
//     if (error.code == "ER_DUP_ENTRY") {
//       return res.status(BAD_REQUEST).send({
//         message: "record already exits",
//       });
//     } else if (error.code == "ER_NO_REFERENCED_ROW_2") {
//       return res.status(BAD_REQUEST).send({
//         message: "user_id is not exits",
//       });
//     } else {
//       sendErrorResponse(res, error);
//     }
//   }
// };



const fileHandler = async (req, res) => {
  try {
    checkAccess(req.user.role_id);
    if (!req.file) {
      throw errorHandler("No file uploaded", 400);
    }

    const rows = [];
    const { buffer } = req.file;
    let firstRowSkip = true;

    const stream = Readable.from(buffer.toString());
    stream
      .pipe(
        csvParser({
          headers: true,
          mapHeaders: ({ header }) => header.trim().toLowerCase(),
        })
      )
      .on("data", (row) => {
        if (firstRowSkip) {
          firstRowSkip = false;
          return;
        }
        const values = Object.values(row)
          .join(" ")
          .split(/\s+/)
          .map((value) => value.trim());
        const [user_id, meter_number, reading_value, reading_date] = values;
        rows.push({ user_id, meter_number, reading_value, reading_date });
      })
      .on("end", async () => {
        console.log("parsed rows:", rows);

        await insertFileRecord(req, res, rows,req.user.email);

        res.status(200).json({ message: "sucessfully all", data: rows });
      });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const updateMeterRecord = async (req, res) => {
  try {
    checkAccess(req.user.role_id);
    const { id } = req.params;

    const { user_id, reading_value, reading_date } = req.body;
    const updated_by = req.user.email;

    isVaildId(id);

    const meterReadingExits = await getreadingByIdFromDB(id);
    if (!meterReadingExits.length) {
      throw errorHandler("meter record not found", NOT_FOUND);
    }

    const updateMeterRecord = await updateMeterRecordInDB(
      user_id,
      reading_value,
      reading_date,
      updated_by,
      id
    );

    if (updateMeterRecord.affectedRows > 0) {
      res.status(200).send({ message: "meter record updated sucessfully" });
    } else {
      throw errorHandler("meter not found", NOT_FOUND);
    }
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(BAD_REQUEST).send({
        message: "record already exits",
      });
    } else if (error.code == "ER_NO_REFERENCED_ROW_2") {
      return res.status(BAD_REQUEST).send({
        message: "user_id is not exits",
      });
    } else {
      sendErrorResponse(res, error);
    }
  }
};

const deleteMeterRecord = async (req, res) => {
  try {
    checkAccess(req.user.role_id);

    const { id } = req.params;

    isVaildId(id);

    const readingExits = await getreadingByIdFromDB(id);
    //console.log(readingExits);
    if (!readingExits.length) {
      throw errorHandler("meter record not found", 404);
    }

    const readingData = await deleteReadingFromDB(id);

    if (readingData.affectedRows > 0) {
      res.status(200).send({ message: "meterRecord deleted sucessfully" });
    } else {
      throw errorHandler("meter record not found", 404);
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export {
  getAllusers,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  getAllMeterRecord,
  createMeterRecord,
  updateMeterRecord,
  deleteMeterRecord,
  fileHandler,
  createMeter
};
