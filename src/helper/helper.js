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
const { ERROR_IN_REGISTER, ERROR_IN_METER_RECORD, ERROR_IN_USER_METER_MAP } =
  constant.messages.error;

const { INTERNAL_SERVER_ERROR } = constant.codes.error;

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
    throw errorHandler("Invalid ID:ID must be positive integer", 400);
  }
};

const registerUserAndCreateMeter = async (userDetails, created_by) => {
  const { password } = userDetails;

  const hashedPassword = await bcrypt.hash(password, 10);
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
    name,
    email,
    contact,
    city,
    address,
    meter_number,
  };
};

const createMeterBillingRecord = async (
  meterRecord,
  user_meter_id,
  created_by
) => {
  const { reading_value, reading_date } = meterRecord;

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

const errorHandler = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sendErrorResponse = (res, error) => {
  res.status(error.statusCode || 500).send({
    message: error.message || "unknown error",
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
