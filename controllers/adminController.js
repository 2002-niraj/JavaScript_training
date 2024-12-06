import {
  errorHandler,
  sendErrorResponse,
  registerUserAndCreateMeter,
  isVaildId,
  createMeterBillingRecord,
  streamReader,
} from "../helper/helper.js";

import {
  getAllUserFromDB,
  updateUserInDB,
  getUserByIdFromDB,
  deleteEventFromDB,
  changeRoleInDB,
  getMeterRecordFromDB,
  updateMeterRecordInDB,
  deleteReadingFromDB,
  getreadingByIdFromDB,
  getMeterNumberFromId,
  getSpecificMeterRecord,
  getUserMapping,
  getMeterRecordPerMonth,
  getUserMeterId,
  updateBillingRecordInDB,
} from "../models/adminModel.js";

import {
  createMeterInDB,
  userMeterMapping,
  getUserDetails,
} from "../models/userModel.js";

import constant from "../constant/constant.js";
import roles from "../constant/roles.js";

import { Readable } from "stream";
import { vaildateMeterRecordForFile } from "../middleware/meterRecordVaildation.js";

const {
  SUCCESS,
  BAD_REQUEST,
  NOT_FOUND,
  CREATED,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
} = constant.codes;
const {
  USER_ALREADY_EXIT,
  ERROR_IN_REGISTER,
  REGISTER_SUCESS,
  USER_NOT_FOUND,
  USERDETAILS_NOT_FOUND,
  USER_EXISTS,
  ROLE_NOT_EXISTS,
  ROLE_CHANGED,
  ROLE_NOT_CHANGED,
  USER_DETAILS_UPDATED,
  USER_DETAILS_NOT_UPDATED,
  EMAIL_EXISTS,
  PERMISSION_DENIED,
  USER_DETAILS_DELETED,
  USER_DETAILS_NOT_DELETED,
  FILE_NOT_UPLOADED,
  INVAILD_FILE,
  VAILDATION_FAILED,
  FILE_PROCESSED,
  METER_NOT_FOUND,
  METER_NOT_ALLOCATE_USER,
  METER_RECORD_EXISTS,
  METER_RECORD_EXISTS_MONTH,
  METER_RECORD_SUCESS
} = constant.messages;

const getAllusers = async (req, res) => {
  try {
    const userData = await getAllUserFromDB();
    res.status(SUCCESS).json(userData);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const createUser = async (req, res) => {
  try {
    const created_by = req.user.email;
    const userDetails = req.body;
    const { email } = userDetails;

    //const {body: userDetails} =req;
    const userExits = await getUserDetails(email);
    if (userExits.length) {
      throw errorHandler(USER_EXISTS, CONFLICT);
    }
    const registerUserByAdmin = await registerUserAndCreateMeter(
      userDetails,
      created_by
    );

    res.status(CREATED).json({
      message: REGISTER_SUCESS,
      user: registerUserByAdmin,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const createMeter = async (req, res) => {
  try {
    const created_by = req.user.email;

    const { user_id } = req.body;

    isVaildId(user_id);

    const userExit = await getUserByIdFromDB(user_id);
    if (!userExit.length) {
      throw errorHandler("user not exits, check again!", 404);
    }

    const meter_number = "M" + [Date.now() + Math.floor(Math.random() * 10)];

    const createMeter = await createMeterInDB(meter_number, created_by);
    if (!createMeter) {
      throw errorHandler("error in creating meter record!", 400);
    }

    const meter_id = createMeter.insertId;

    const user_meter_map = await userMeterMapping(
      user_id,
      meter_id,
      created_by
    );
    if (!user_meter_map) {
      throw errorHandler("error in creating user_meter_map");
    }

    res.status(CREATED).json({
      message: "meter number created sucessfully",
      userData: {
        ...userExit,
        meter_number: meter_number,
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

const updateUser = async (req, res) => {
  try {
    const updated_by = req.user.email;

    const { id } = req.params;
    const { name, email, contact, city, address } = req.body;

    isVaildId(id);

    const dataExits = await getUserByIdFromDB(id);
    if (!dataExits.length) {
      throw errorHandler(USER_NOT_FOUND, NOT_FOUND);
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
      res.status(SUCCESS).send({ message: USER_DETAILS_UPDATED });
    } else {
      throw errorHandler( USER_DETAILS_NOT_UPDATED, INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
     
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(CONFLICT).send({
        message: EMAIL_EXISTS,
      })
    }
    else{
      sendErrorResponse(res, error);
    }
  }
};

const deleteUser = async (req, res) => {

  try {
    const { id } = req.params;

    isVaildId(id);

    const userExits = await getUserByIdFromDB(id);
    if (!userExits.length) {
      throw errorHandler(USERDETAILS_NOT_FOUND, NOT_FOUND);
    }

    const role_id_DB = userExits[0].role_id;

    if (role_id_DB == 1) {
      throw errorHandler(PERMISSION_DENIED, 403);
    }

    const userData = await deleteEventFromDB(id);

    if (userData.affectedRows > 0) {
      res.status(SUCCESS).send({ message:  USER_DETAILS_DELETED });
    } else {
      throw errorHandler(USER_DETAILS_NOT_DELETED, INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id } = req.body;

    isVaildId(id);

    const userDetails = await getUserByIdFromDB(id);

    if (!userDetails.length) {
      throw errorHandler(USERDETAILS_NOT_FOUND, NOT_FOUND);
    }

    const role_Id_Exists = Object.values(roles).includes(role_id);
    if (!role_Id_Exists) {
      throw errorHandler(ROLE_NOT_EXISTS, NOT_FOUND);
    }

    const changeRole = await changeRoleInDB(id, role_id);

    if (changeRole.affectedRows > 0) {
      res.status(SUCCESS).send({ message: ROLE_CHANGED });
    } else {
      throw errorHandler(ROLE_NOT_CHANGED, INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const getAllMeterRecord = async (req, res) => {
  try {
    const meterRecords = await getMeterRecordFromDB();
    res.status(SUCCESS).json(meterRecords);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const createMeterRecord = async (req, res) => {
  try {
    const created_by = req.user.email;
    const { user_id, meter_id, reading_date } = req.body;

    const userExists = await getUserByIdFromDB(user_id);
    if (!userExists.length) {
      throw errorHandler(USER_NOT_FOUND, NOT_FOUND);
    }

    const meterExists = await getMeterNumberFromId(meter_id);
    if (!meterExists.length) {
      throw errorHandler(METER_NOT_FOUND, NOT_FOUND);
    }

    const user_meterExists = await getUserMapping(user_id, meter_id);
    if (!user_meterExists.length) {
      throw errorHandler(METER_NOT_ALLOCATE_USER,NOT_FOUND);
    }

    const readingExists = await getSpecificMeterRecord(
      user_id,
      meter_id,
      reading_date
    );
    if (readingExists.length) {
      throw errorHandler( METER_RECORD_EXISTS, CONFLICT);
    }

    const exitingReading = await getMeterRecordPerMonth(
      user_id,
      meter_id,
      reading_date
    );
    if (exitingReading.length) {
      throw errorHandler(
        METER_RECORD_EXISTS_MONTH,
        CONFLICT
      );
    }

    const meterRecord = req.body;
    const user_meter_id = user_meterExists[0].id;

    const meter_reading = await createMeterBillingRecord(
      meterRecord,
      user_meter_id,
      created_by
    );

    res.status(SUCCESS).json({
      message: METER_RECORD_SUCESS,
      meterRecord: meter_reading,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const fileHandler = async (req, res) => {
  try {
    const created_by = req.user.email;
    if (!req.file) {
      throw errorHandler(FILE_NOT_UPLOADED, NOT_FOUND);
    }

    if (req.file.mimetype !== "text/csv") {
      throw errorHandler(INVAILD_FILE, 400);
    }

    const { buffer } = req.file;

    const stream = Readable.from(buffer.toString());

    const meterRecords = await streamReader(stream);

    const { error } = vaildateMeterRecordForFile.validate(meterRecords,{ abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: VAILDATION_FAILED,
        details: error.message,
      });
    }

    let lineNumber = 0;
    for (const meterRecord of meterRecords) {
      const { user_id, meter_id, reading_value, reading_date } = meterRecord;

      lineNumber++;
      const userExists = await getUserByIdFromDB(user_id);
      if (!userExists.length) {
        return res.status(404).json({
          message: `User does not exist error at file line ${lineNumber}`,
        });
      }

      const meterExists = await getMeterNumberFromId(meter_id);
      if (!meterExists.length) {
        return res.status(404).json({
          message: `Meter does not exist error at file line ${lineNumber}`,
        });
      }

      const userMeterExists = await getUserMapping(user_id, meter_id);
      if (!userMeterExists.length) {
        return res.status(404).json({
          message: `This meter is not allocated to the current user error at file line ${lineNumber}`,
        });
      }

      const readingExists = await getSpecificMeterRecord(
        user_id,
        meter_id,
        reading_date
      );
      if (readingExists.length) {
        return res.status(409).json({
          message: `Reading already exists for this meter error at file line ${lineNumber}`,
        });
      }

      const existingReading = await getMeterRecordPerMonth(
        user_id,
        meter_id,
        reading_date
      );
      if (existingReading.length) {
        return res.status(409).json({
          message: `Reading already exists for this month error at file line ${lineNumber}`,
        });
      }
    }

    for (const meterRecord of meterRecords) {
      const { user_id, meter_id} = meterRecord;
      const user_meterExists = await getUserMapping(user_id, meter_id);
      const user_meter_id = user_meterExists[0].id;

      const meter_reading = await createMeterBillingRecord(
        meterRecord,
        user_meter_id,
        created_by
      );

      console.log(meter_reading);
    }
    res.status(200).json({
      message: FILE_PROCESSED,
      data: meterRecords,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const updateMeterRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const { reading_value, reading_date } = req.body;
    const updated_by = req.user.email;

    isVaildId(id);

    const meterReadingExits = await getreadingByIdFromDB(id);
    if(!meterReadingExits.length){
      throw errorHandler("meter record not found", NOT_FOUND);
    }
    
    const updateMeterRecord = await updateMeterRecordInDB(
      reading_value,
      reading_date,
      updated_by,
      id
    );

    if (updateMeterRecord.affectedRows > 0) {

      const updateBillingRecord = await updateBillingRecordInDB(
        reading_value * 5,
        updated_by,
        id
      );


      if (updateBillingRecord.affectedRows > 0) {
        res.status(SUCCESS).send({ message: "meter record updated sucessfully" });
      }

    } 
    else {
      throw errorHandler("Meter record not updated", INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
     
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(CONFLICT).json({
        message: "Meter record current date already exits",
      });
    }
    else{
      sendErrorResponse(res,error);
    }
  }

};

const deleteMeterRecord = async (req, res) => {
  try {
    const { id } = req.params;

    isVaildId(id);

    const readingExits = await getreadingByIdFromDB(id);
    if (!readingExits.length) {
      throw errorHandler("Meter record does not exits", NOT_FOUND);
    }

    const readingData = await deleteReadingFromDB(id);

    if (readingData.affectedRows > 0) {
      res.status(SUCCESS).json({ message: "meterRecord deleted sucessfully" });
    } else {
      throw errorHandler("Meter record not deleted", INTERNAL_SERVER_ERROR);
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
  createMeter,
};
