import { errorHandler, sendErrorResponse } from "../helper/helper.js";
import {
  getAllUserFromDB,
  updateUserInDB,
  getUserByIdFromDB,
  deleteEventFromDB,
  changeRoleInDB,
  getMeterRecordFromDB,
  createMeterRecordInDB,
  createMeterInDB,
  updateMeterRecordInDB,
  deleteReadingFromDB,
  getreadingByIdFromDB,
  readingExitsInDB,
  meterExitsInDB,
} from "../models/adminModel.js";
import bcrypt from "bcrypt";
import {
  getUserFromDB,
  registerUserInDB,
  restoreUserInDB,
} from "../models/userModel.js";

import constant from "../constant/constant.js";
const { SUCCESS, BAD_REQUEST, NOT_FOUND, CREATED, ER_DUP_ENTRY } =
  constant.codes;
const { USER_ALREADY_EXIT, ERROR_IN_REGISTER, REGISTER_SUCESS } =
  constant.messages;

const getAllusers = async (req, res) => {
  try {
    const role_id = req.user.role_id;

    if (role_id == 3) {
      throw errorHandler("access denied!", BAD_REQUEST);
    }
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
    const role_id = req.user.role_id;
    if (role_id == 3) {
      throw errorHandler("access denied!", BAD_REQUEST);
    }

    const created_by = req.user.email;

    const { name, email, password, contact, city, address } = req.body;

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
          address,
          created_by
        );
        if (!restoreUserResult) {
          throw errorHandler(ERROR_IN_REGISTER, BAD_REQUEST);
        }

        return res.status(SUCCESS).json({
          message: REGISTER_SUCESS,
          user: {
            name,
            email,
            contact,
            city,
            address,
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
      address,
      created_by
    );

    if (!registerUser) {
      throw errorHandler("error in registeration", BAD_REQUEST);
    }

    res.status(CREATED).json({
      message: "user Registered sucessfully",
      user: {
        name,
        email,
        contact,
        city,
        address,
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
    const role_id = req.user.role_id;
    if (role_id == 3) {
      throw errorHandler("access denied!", BAD_REQUEST);
    }
    const updated_by = req.user.email;

    const { id } = req.params;
    const { name, email, contact, city, address } = req.body;

    if (isNaN(Number(id))) {
      throw errorHandler("invaild id", 400);
    }

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
    const role_id = req.user.role_id;

    if (role_id == 3) {
      throw errorHandler("access denied!", 404);
    }

    const { id } = req.params;

    if (isNaN(Number(id))) {
      throw errorHandler("invaild id", 400);
    }

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
    sendErrorResponse(res, error);
  }
};

const getAllMeterRecord = async (req, res) => {
  try {
    const role_id = req.user.role_id;
    if (role_id == 3) {
      throw errorHandler("access denied!", 404);
    }

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

const createMeterRecord = async (req, res) => {
  try {
    const role_id = req.user.role_id;
    if (role_id == 3) {
      throw errorHandler("access denied!", 404);
    }

    const { user_id, meter_number, reading_value, reading_date } = req.body;

    const readingExits = await readingExitsInDB(user_id, reading_date);
    if (readingExits.length > 0) {
      throw errorHandler("meter record already exits", 400);
    }

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
      const meter_id = readingExits[0].meter_id;
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


const fileHandler = async (req, res) => {
  try {
    const role_id = req.user.role_id;
    if (role_id == 3) {
      throw errorHandler("access denied!", 404);
    }

    if (!req.file) {
      throw errorHandler("No file uploaded", 400);
    }

    console.log(req.file.path);
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

const updateMeterRecord = async (req, res) => {
  try {
    const role_id = req.user.role_id;
    if (role_id == 3) {
      throw errorHandler("access denied!", 404);
    }
    const { id } = req.params;

    const { user_id, reading_value, reading_date } = req.body;
    const updated_by = req.user.email;

    if (isNaN(Number(id))) {
      throw errorHandler("invaild id", BAD_REQUEST);
    }

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
    const role_id = req.user.role_id;
    if (role_id == 3) {
      throw errorHandler("access denied!", 404);
    }

    const { id } = req.params;

    if (isNaN(Number(id))) {
      throw errorHandler("invaild id", 400);
    }

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
};
