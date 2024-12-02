import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getAllusers,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  getAllMeterRecord,
  createMeterRecord,
  updateMeterRecord,
  deleteMeterRecord,fileHandler
} from "../controllers/adminController.js";

import constant from "../constant/constant.js";
const {
  GET_ALL_USERS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  CHANGE_ROLE,
  GET_ALL_METERRECORD,
  CREATE_METERRECORD,
  UPDATE_METERRECORD,
  DELETE_METERRECORD,
} = constant.routes;

import upload from "../config/fileUpload.js";
import { vaildateCreateUser,vaildateUpdateUser } from '../middleware/userVaildation.js';
import { vaildateCreateMeterRecord ,vaildateUpdateMeterRecord} from '../middleware/meterRecordVaildation.js'

const adminRoute = express.Router();

adminRoute.get(GET_ALL_USERS, verifyToken, getAllusers);
adminRoute.post(CREATE_USER, verifyToken, vaildateCreateUser, createUser);
adminRoute.put(UPDATE_USER,verifyToken,vaildateUpdateUser, updateUser);
adminRoute.patch(DELETE_USER, verifyToken, deleteUser);
adminRoute.patch(CHANGE_ROLE, verifyToken, changeUserRole);

adminRoute.get(GET_ALL_METERRECORD, verifyToken, getAllMeterRecord);
adminRoute.post(CREATE_METERRECORD,  verifyToken, vaildateCreateMeterRecord, createMeterRecord);
adminRoute.put(UPDATE_METERRECORD,  verifyToken, vaildateUpdateMeterRecord, updateMeterRecord);
adminRoute.patch(DELETE_METERRECORD, verifyToken, deleteMeterRecord);

adminRoute.post('/fileupload',verifyToken,upload.single('file'),fileHandler)

export default adminRoute;


