import {
  errorHandler,
  sendErrorResponse,
  registerUserAndCreateMeter,
  isVaildId,
} from "../helper/helper.js";

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
  getMeterNumberFromId,
  getSpecificMeterRecord,
  getUserMapping,
  createBillingRecordInDB,
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

import csvParser from "csv-parser";
import { Readable } from "stream";
import { vaildateMeterRecordForFile } from "../middleware/meterRecordVaildation.js";

const {
  SUCCESS,
  BAD_REQUEST,
  NOT_FOUND,
  CREATED,
  ER_DUP_ENTRY,
  INTERNAL_SERVER_ERROR,CONFLICT
} = constant.codes;
const { USER_ALREADY_EXIT, ERROR_IN_REGISTER, REGISTER_SUCESS ,USERDETAILS_NOT_FOUND,USER_EXISTS} =
  constant.messages;


const getAllusers = async (req, res) => {
  try {
    const userData = await getAllUserFromDB();
    if (!userData.length) {
      throw errorHandler(USERDETAILS_NOT_FOUND,NOT_FOUND);
    }
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
    if(userExits.length){
      throw errorHandler( USER_EXISTS,CONFLICT);
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
    } else {
      sendErrorResponse(res, error);
    }
  }
};

const getAllMeterRecord = async (req, res) => {
  try {
    const meterRecords = await getMeterRecordFromDB();
    if (!meterRecords.length) {
      throw errorHandler("meterrecord not found!", 404);
    }
    res.status(SUCCESS).json(meterRecords);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const createMeterBillingRecord = async (
  res,
  meterRecord,
  user_meter_id,
  created_by
) => {
  const { user_id, meter_id, reading_value, reading_date } = meterRecord;

  const createMeterRecord = await createMeterRecordInDB(
    user_meter_id,
    reading_value,
    reading_date,
    created_by
  );
  if (!createMeterRecord) {
    throw errorHandler("error in creating meter record", 400);
  }

  const meter_reading_id = createMeterRecord.insertId;

  const createBillingRecord = await createBillingRecordInDB(
    meter_reading_id,
    reading_value * 5,
    created_by
  );

  if (!createBillingRecord) {
    throw errorHandler("error in creating billing record", 400);
  }

  return meterRecord;


};

const createMeterRecord = async (req, res) => {
  try {
    const created_by = req.user.email;
    const { user_id, meter_id, reading_value, reading_date } = req.body;

    const userExists = await getUserByIdFromDB(user_id);
    if (!userExists.length) {
      throw errorHandler("User does not exits", 404);
    }

    const meterExists = await getMeterNumberFromId(meter_id);
    if (!meterExists.length) {
      throw errorHandler("Meter does not exits", 404);
    }

    const user_meterExists = await getUserMapping(user_id, meter_id);
    if (!user_meterExists.length) {
      throw errorHandler("this meter is not allocate to current user");
    }

    const readingExists = await getSpecificMeterRecord(
      user_id,
      meter_id,
      reading_date
    );
    if (readingExists.length) {
      throw errorHandler("Meter record for this date already exists", 409);
    }

    const exitingReading = await getMeterRecordPerMonth(
      user_id,
      meter_id,
      reading_date
    );
    if (exitingReading.length) {
      throw errorHandler(
        "meter record for this meter already exists for this month",
        409
      );
    }

    const meterRecord = req.body;
    const user_meter_id = user_meterExists[0].id;

    const meter_reading = await createMeterBillingRecord(res, meterRecord, user_meter_id, created_by);

    res.status(200).json({
      message: "meter record created sucessfully!",
      meterRecord: meter_reading,
    });

  } catch (error) {
      sendErrorResponse(res,error);
  }
};


const streamReader = async (stream) => {
  const meterRecords = [];
  let firstRowSkip = true;
  stream
    .pipe(
      csvParser({
        headers: true,
        mapHeaders: ({ header }) => header.trim().toLowerCase(),
      })
    )
    .on("data", async (row) => {
      if (firstRowSkip) {
        firstRowSkip = false;
        return;
      }

      const values = Object.values(row)
        .join(" ")
        .split(/\s+/)
        .map((value) => value.trim());
      const [user_id, meter_id, reading_value, reading_date] = values;

      meterRecords.push({
        user_id: parseInt(user_id, 10),
        meter_id: parseInt(meter_id, 10),
        reading_value: parseFloat(reading_value),
        reading_date,
      });
    });

  return meterRecords;
};

const fileHandler = async (req, res) => {
  try {
    
    const created_by = req.user.email;
    if (!req.file) {
      throw errorHandler("No file uploaded", 400);
    }

    if (req.file.mimetype !== "text/csv") {
      throw errorHandler(
        "Invalid file type Only csv files are allowed.",400
      );
    }

    const { buffer } = req.file;

    const stream = Readable.from(buffer.toString());
    

    const meterRecords = await streamReader(stream);

    const { error } = vaildateMeterRecordForFile.validate(meterRecords);
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.message
      });
    }
    
    let lineNumber = 0;
    for (const meterRecord of meterRecords) {
      const { user_id, meter_id, reading_value, reading_date } = meterRecord;
       
       lineNumber++;
      const userExists = await getUserByIdFromDB(user_id);
      if (!userExists.length) {
        return res.status(404).json({
          message: `User does not exist error at file line ${lineNumber}`
        });
      }

    const meterExists = await getMeterNumberFromId(meter_id);
      if (!meterExists.length) {
        return res.status(404).json({
          message: `Meter does not exist error at file line ${lineNumber}`
        });
      }

      const userMeterExists = await getUserMapping(user_id, meter_id);
      if (!userMeterExists.length) {
        return res.status(404).json({
          message: `This meter is not allocated to the current user error at file line ${lineNumber}`
        });
      }

      const readingExists = await getSpecificMeterRecord(
        user_id,
        meter_id,
        reading_date
      );
      if (readingExists.length) {
        return res.status(409).json({
          message: `Reading already exists for this meter error at file line ${lineNumber}`
        });
      }

      const existingReading = await getMeterRecordPerMonth(
        user_id,
        meter_id,
        reading_date
      );
      if (existingReading.length) {
        return res.status(409).json({
          message: `Reading already exists for this month error at file line ${lineNumber}`
        });
      }
    }

    for( const meterRecord of meterRecords){
       
      const { user_id, meter_id, reading_value, reading_date } = meterRecord;
      const user_meterExists = await getUserMapping(user_id, meter_id);
      const user_meter_id = user_meterExists[0].id;
      
      const meter_reading = await createMeterBillingRecord(res, meterRecord, user_meter_id, created_by);
       
      console.log(meter_reading);
    
    }
    res.status(200).json({
      message: "File processed successfully",
      data: meterRecords
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

    const user_meter_id = await getUserMeterId(id);

    if (!getUserMeterId.length) {
      throw errorHandler("meter Record not exits", 400);
    }

    const meter_id = user_meter_id[0].meter_id;
    const user_id = user_meter_id[0].user_id;

    const readingExists = await getSpecificMeterRecord(
      user_id,
      meter_id,
      reading_date
    );
    if (readingExists.length) {
      throw errorHandler("Meter record for this date already exists", 409);
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
        res.status(200).send({ message: "meter record updated sucessfully" });
      }
    } else {
      throw errorHandler("meter_records not found", NOT_FOUND);
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
    const { id } = req.params;

    isVaildId(id);

    const readingExits = await getreadingByIdFromDB(id);
    if (!readingExits.length) {
      throw errorHandler("Meter record does not exits", 404);
    }

    const readingData = await deleteReadingFromDB(id);

    if (readingData.affectedRows > 0) {
      res.status(200).send({ message: "meterRecord deleted sucessfully" });
    } else {
      throw errorHandler("Meter record does not exits", 404);
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
  isVaildId,
};
