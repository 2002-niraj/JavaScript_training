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
  getSpecificMeterRecord,
  getUserMapping,
  getMeterRecordPerMonth,
  updateBillingRecordInDB,
  getMeterIdFromNumber,
  getCountMeterNumber,
  getreadingForUpdate,
} from "../models/adminModel.js";

import {
  createMeterInDB,
  userMeterMapping,
  getUserDetails,
} from "../models/userModel.js";

import constant from "../constant/constant.js";
const {
  REGISTER_SUCESS,
  USER_DETAILS_UPDATED,
  USER_DETAILS,
  ROLE_CHANGED,
  FILE_PROCESSED,
  USER_DETAILS_DELETED,
  METER_RECORD_SUCESS,METER_CREATED,NO_CHANGES_DETECTED, METER_UPDATED,METER_DELETED
} = constant.messages.success;

const roles = constant.roles;
const {
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
  USER_DETAILS_NOT_UPDATED,
  PERMISSION_DENIED,
  LIMIT_EXCEED,
  USER_DETAILS_NOT_DELETED,
  METER_RECORD_EXISTS,
  FILE_NOT_UPLOADED,
  INVAILD_FILE,
  VAILDATION_FAILED,
  ROLE_NOT_EXISTS,
  ROLE_NOT_CHANGED,
  METER_RECORD_NOT_FOUND,
  METER_NOT_FOUND,
  METER_NOT_ALLOCATE_USER, ERROR_UPDATEDING_METER_RECORD,METER_NOT_UPDATED, METER_NOT_DELETED,
  METER_RECORD_EXISTS_MONTH,USER_NOT_EXISTS, ERROR_CREATING_RECORD ,ERROR_CREATING_USER_METER_MAP
} = constant.messages.error;

const { SUCCESS, CREATED } = constant.codes.success;

const { NOT_FOUND, CONFLICT, INTERNAL_SERVER_ERROR, BAD_REQUEST, FORBIDDEN,VALIDATION_FAILED } =
  constant.codes.error;

import { Readable } from "stream";
import { validateMeterRecordForFile } from "../middleware/meterRecordVaildation.js";

const getAllusers = async (req, res) => {
  try {
    const { user_id, role_id } = req.user;
    const userData = await getAllUserFromDB(user_id, role_id);
    res.status(SUCCESS).json({
      message: USER_DETAILS,
      statusCode: SUCCESS,
      userData,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const createUser = async (req, res) => {
  try {
    const created_by = req.user.email;
    const userDetails = req.body;
    const { email } = userDetails;

    const userExits = await getUserDetails(email);
    if (userExits) {
      throw errorHandler(USER_ALREADY_EXISTS, CONFLICT);
    }

    const registerUserByAdmin = await registerUserAndCreateMeter(
      userDetails,
      created_by,
      true
    );

    res.status(CREATED).json({
      message: REGISTER_SUCESS,
      statusCode: CREATED,
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

    const limitExceed = await getCountMeterNumber(user_id);

    if (limitExceed.meter_count > 5) {
      throw errorHandler(LIMIT_EXCEED, CONFLICT);
    }

    const userExit = await getUserByIdFromDB(user_id);
    if (!userExit) {
      throw errorHandler(USER_NOT_EXISTS, NOT_FOUND);
    }

    const meter_number = "M" + [Date.now() + Math.floor(Math.random() * 10)];

    const createMeter = await createMeterInDB(meter_number, created_by);
    if (!createMeter) {
      throw errorHandler(
        ERROR_CREATING_RECORD,
        INTERNAL_SERVER_ERROR
      );
    }

    const meter_id = createMeter.insertId;

    const user_meter_map = await userMeterMapping(
      user_id,
      meter_id,
      created_by
    );
    if (!user_meter_map) {
      throw errorHandler(
        ERROR_CREATING_USER_METER_MAP,
        INTERNAL_SERVER_ERROR
      );
    }

    res.status(CREATED).json({
      message: METER_CREATED,
      statusCode: CREATED,
      userData: {
        ...userExit,
        meter_number: meter_number,
      },
    });
  } catch (error) {
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
    if (!dataExits) {
      throw errorHandler(USER_NOT_FOUND, NOT_FOUND);
    }

    if (email != dataExits.email) {
      const duplicateEntryExists = await getUserDetails(email);
      if (duplicateEntryExists.length) {
        throw errorHandler(USER_ALREADY_EXISTS, CONFLICT);
      }
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
      res
        .status(SUCCESS)
        .json({ message: USER_DETAILS_UPDATED, statusCode: SUCCESS });
    } else {
      throw errorHandler(USER_DETAILS_NOT_UPDATED, INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    isVaildId(id);

    const userExits = await getUserByIdFromDB(id);
    if (!userExits) {
      throw errorHandler(USER_NOT_FOUND, NOT_FOUND);
    }

    const role_id_DB = userExits.role_id;

    if (role_id_DB == 1) {
      throw errorHandler(PERMISSION_DENIED, FORBIDDEN);
    }

    const userData = await deleteEventFromDB(id);

    if (userData.affectedRows > 0) {
      res
        .status(SUCCESS)
        .json({ message: USER_DETAILS_DELETED, statusCode: SUCCESS });
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

    if (!userDetails) {
      throw errorHandler(USER_NOT_FOUND, NOT_FOUND);
    }

    const role_Id_Exists = Object.values(roles).includes(role_id);
    if (!role_Id_Exists) {
      throw errorHandler(ROLE_NOT_EXISTS, NOT_FOUND);
    }

    const changeRole = await changeRoleInDB(id, role_id);

    if (changeRole.affectedRows > 0) {
      res.status(SUCCESS).send({ message: ROLE_CHANGED, statusCode: SUCCESS });
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
    res.status(SUCCESS).json({
      meterRecords,
      statusCode: SUCCESS,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const createMeterRecord = async (req, res) => {
  try {
    const created_by = req.user.email;
    const { user_id, meter_number, reading_date, is_paid } = req.body;

    const userExists = await getUserByIdFromDB(user_id);
    if (!userExists) {
      throw errorHandler(USER_NOT_FOUND, NOT_FOUND);
    }

    const meterExists = await getMeterIdFromNumber(meter_number);
    if (!meterExists.length) {
      throw errorHandler(METER_NOT_FOUND, NOT_FOUND);
    }

    const meter_id = meterExists[0].id;

    const user_meterExists = await getUserMapping(user_id, meter_id);
    if (!user_meterExists.length) {
      throw errorHandler(METER_NOT_ALLOCATE_USER, NOT_FOUND);
    }

    const readingExists = await getSpecificMeterRecord(
      user_id,
      meter_id,
      reading_date
    );
    if (readingExists.length) {
      throw errorHandler(METER_RECORD_EXISTS, CONFLICT);
    }

    const exitingReading = await getMeterRecordPerMonth(
      user_id,
      meter_id,
      reading_date
    );
    if (exitingReading.length) {
      throw errorHandler(METER_RECORD_EXISTS_MONTH, CONFLICT);
    }

    const meterRecord = req.body;
    meterRecord.meter_id = meter_id;
    meterRecord.is_paid = is_paid;
    const user_meter_id = user_meterExists[0].id;

    const meter_reading = await createMeterBillingRecord(
      meterRecord,
      user_meter_id,
      created_by
    );

    res.status(SUCCESS).json({
      message: METER_RECORD_SUCESS,
      statusCode: SUCCESS,
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
      throw errorHandler(FILE_NOT_UPLOADED, BAD_REQUEST);
    }

    if (req.file.mimetype !== "text/csv") {
      throw errorHandler(INVAILD_FILE, 400);
    }

    const { buffer } = req.file;

    const stream = Readable.from(buffer.toString());

    const meterRecords = await streamReader(stream);

    const { error } = validateMeterRecordForFile.validate(meterRecords, {
      abortEarly: false,
    });
    if (error) {
      return res.status(VALIDATION_FAILED).json({
        message: VAILDATION_FAILED,
        details: error.message,
        statusCode: VALIDATION_FAILED,
      });
    }

    let lineNumber = 0;
    for (const meterRecord of meterRecords) {
      const { user_id, meter_number, reading_value, reading_date, is_paid } =
        meterRecord;

      lineNumber++;
      const userExists = await getUserByIdFromDB(user_id);
      if (!userExists) {
        return res.status(NOT_FOUND).json({
          message: `User does not exist error at file line ${lineNumber}`,
          statusCode: NOT_FOUND,
        });
      }

      const meterExists = await getMeterIdFromNumber(meter_number);
      if (!meterExists.length) {
        return res.status(404).json({
          message: `meter is not found ${lineNumber}`,
        });
      }

      const meter_id = meterExists[0].id;
      meterRecord.meter_id = meter_id;

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
        return res.status(CONFLICT).json({
          message: `Reading already exists for this meter error at file line ${lineNumber}`,
        });
      }

      const existingReading = await getMeterRecordPerMonth(
        user_id,
        meter_id,
        reading_date
      );
      if (existingReading.length) {
        return res.status(CONFLICT).json({
          message: `Reading already exists for this month error at file line ${lineNumber}`,
        });
      }
    }

    for (const meterRecord of meterRecords) {
      const { user_id, meter_id } = meterRecord;
      const user_meterExists = await getUserMapping(user_id, meter_id);
      const user_meter_id = user_meterExists[0].id;

      const meter_reading = await createMeterBillingRecord(
        meterRecord,
        user_meter_id,
        created_by
      );

      console.log(meter_reading);
    }
    res.status(SUCCESS).json({
      message: FILE_PROCESSED,
      statusCode: SUCCESS,
      data: meterRecords,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const updateMeterRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      reading_value,
      reading_date,
      billing_amount,
      is_paid = "No",
    } = req.body;
    const updated_by = req.user.email;

    isVaildId(id);

    const meterReadingExits = await getreadingForUpdate(id);
    if (!meterReadingExits.length) {
      throw errorHandler(METER_RECORD_NOT_FOUND, NOT_FOUND);
    }

    const existingMeterRecord = meterReadingExits[0];
    const existingReadingValue = existingMeterRecord.reading_value;
    const existingReadingDate = new Date(existingMeterRecord.reading_date)
      .toISOString()
      .split("T")[0];
    const existingBillingAmount = existingMeterRecord.billing_amount;
    const existingIsPaid = existingMeterRecord.is_paid;
    const user_id = existingMeterRecord.user_id;
    const meter_id = existingMeterRecord.meter_id;

    if (
      reading_value == existingReadingValue &&
      reading_date == existingReadingDate &&
      billing_amount == existingBillingAmount &&
      is_paid == existingIsPaid
    ) {
      return res.status(SUCCESS).json({
        message: NO_CHANGES_DETECTED,
        statusCode: SUCCESS,
      });
    }

    const updatedMeterRecord = await updateMeterRecordInDB(
      reading_value,
      reading_date,
      updated_by,
      id
    );

    if (updatedMeterRecord.affectedRows > 0) {
      const updateBillingRecord = await updateBillingRecordInDB(
        billing_amount,
        is_paid,
        updated_by,
        id
      );

      if (updateBillingRecord.affectedRows > 0) {
        return res.status(SUCCESS).json({
          message: METER_UPDATED,
          statusCode: SUCCESS,
        });
      } else {
        throw errorHandler(
          ERROR_UPDATEDING_METER_RECORD,
          INTERNAL_SERVER_ERROR
        );
      }
    } else {
      throw errorHandler(METER_NOT_UPDATED, INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const deleteMeterRecord = async (req, res) => {
  try {
    const { id } = req.params;

    isVaildId(id);

    const readingExits = await getreadingByIdFromDB(id);
    if (!readingExits.length) {
      throw errorHandler(METER_RECORD_NOT_FOUND, NOT_FOUND);
    }

    const readingData = await deleteReadingFromDB(id);

    if (readingData.affectedRows > 0) {
      res
        .status(SUCCESS)
        .json({
          message: METER_DELETED,
          statusCode: SUCCESS,
        });
    } else {
      throw errorHandler( METER_NOT_DELETED, INTERNAL_SERVER_ERROR);
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
