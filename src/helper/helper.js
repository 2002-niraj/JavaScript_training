import db from "../config/dbConnection.js";
import bcrypt from "bcrypt";

import {
  registerUserInDB,
  createMeterInDB,
  userMeterMapping,
} from "../models/userModel.js";

import {
  createMeterRecordInDB,
  createBillingRecordInDB,
} from "../models/adminModel.js";

import csvParser from "csv-parser";

import constant from "../constant/constant.js";
const {
  ERROR_IN_REGISTER,
  ERROR_IN_METER_RECORD,
  ERROR_IN_USER_METER_MAP,
  INVAILD_ID,
  ERROR_CREATING_RECORD, ERROR_CREATING_BILLING
} = constant.messages.error;

const { INTERNAL_SERVER_ERROR, VALIDATION_FAILED } = constant.codes.error;

const executeQuery = (query, parameter = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, parameter, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

const isVaildId = (id) => {
  if (!/^\d+$/.test(id)) {
    throw errorHandler(INVAILD_ID, VALIDATION_FAILED);
  }
};

const registerUserAndCreateMeter = async (
  userDetails,
  created_by,
  isAdmin = false
) => {
  const { name, contact, password } = userDetails;

  let finalPassword;
  if (isAdmin) {
    finalPassword = name.substring(0, 3).toLowerCase() + contact.slice(-3);
  } else {
    finalPassword = password;
  }

  const hashedPassword = await bcrypt.hash(finalPassword, 10);

  const registerUser = await registerUserInDB(
    userDetails,
    hashedPassword,
    created_by
  );
  if (!registerUser) {
    throw errorHandler(ERROR_IN_REGISTER, INTERNAL_SERVER_ERROR);
  }

  const meter_number = "M" + [Date.now() + Math.floor(Math.random() * 10)];

  const createMeter = await createMeterInDB(meter_number, created_by);
  if (!createMeter) {
    throw errorHandler(ERROR_IN_METER_RECORD, INTERNAL_SERVER_ERROR);
  }

  const userId = registerUser.insertId;
  const meter_id = createMeter.insertId;

  const user_meter_map = await userMeterMapping(userId, meter_id, created_by);
  if (!user_meter_map) {
    throw errorHandler(ERROR_IN_USER_METER_MAP, INTERNAL_SERVER_ERROR);
  }

  return {
    userDetails,
    meter_number,
  };

};

const createMeterBillingRecord = async (
  meterRecord,
  user_meter_id,
  created_by
) => {
  const { reading_value, reading_date, is_paid = "No" } = meterRecord;

  const RATE_PER_UNIT = 5;

  const billing_amount = reading_value * RATE_PER_UNIT;

  const createMeterRecord = await createMeterRecordInDB(
    user_meter_id,
    reading_value,
    reading_date,
    created_by
  );
  if (!createMeterRecord) {
    throw errorHandler(ERROR_CREATING_RECORD, INTERNAL_SERVER_ERROR);
  }

  const meter_reading_id = createMeterRecord.insertId;

  const createBillingRecord = await createBillingRecordInDB(
    meter_reading_id,
    billing_amount,
    is_paid,
    created_by
  );

  if (!createBillingRecord) {
    throw errorHandler(
      ERROR_CREATING_BILLING,
      INTERNAL_SERVER_ERROR
    );
  }

  return meterRecord;
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
      const [
        user_id,
        meter_number,
        reading_value,
        reading_date,
        is_paid = "No",
      ] = values;

      meterRecords.push({
        user_id: parseInt(user_id, 10),
        meter_number,
        reading_value: parseFloat(reading_value),
        reading_date,
        is_paid,
      });
    });

  return meterRecords;
};

const errorHandler = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sendErrorResponse = (res, error) => {
  res.status(error.statusCode || 500).send({
    message: error.message || "unknown error",
    statusCode: error.statusCode,
  });
};

export {
  executeQuery,
  errorHandler,
  sendErrorResponse,
  registerUserAndCreateMeter,
  isVaildId,
  createMeterBillingRecord,
  streamReader,
};
