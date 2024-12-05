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
  deleteMeterRecord,fileHandler,createMeter
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
  CREATE_METER
} = constant.routes;

import checkAccess from '../middleware/checkAccess.js'

import roles from '../constant/roles.js'

import upload from "../config/fileUpload.js";
import { vaildateCreateUser,vaildateUpdateUser } from '../middleware/userVaildation.js';
import { vaildateCreateMeterRecord ,vaildateUpdateMeterRecord} from '../middleware/meterRecordVaildation.js'

const adminRoute = express.Router();

adminRoute.get(GET_ALL_USERS, verifyToken, checkAccess([roles.SUPERADMIN,roles.ADMIN]), getAllusers);
adminRoute.post(CREATE_USER, verifyToken, checkAccess([roles.SUPERADMIN,roles.ADMIN]), vaildateCreateUser, createUser);
adminRoute.put(UPDATE_USER,verifyToken,checkAccess([roles.SUPERADMIN,roles.ADMIN]),vaildateUpdateUser, updateUser);
adminRoute.patch(DELETE_USER, verifyToken,checkAccess([roles.SUPERADMIN,roles.ADMIN]), deleteUser);
adminRoute.patch(CHANGE_ROLE, verifyToken, checkAccess([roles.SUPERADMIN]), changeUserRole);

adminRoute.post(CREATE_METER,verifyToken, checkAccess([roles.SUPERADMIN,roles.ADMIN]), createMeter)
adminRoute.get(GET_ALL_METERRECORD, verifyToken,checkAccess([roles.SUPERADMIN,roles.ADMIN]), getAllMeterRecord);

adminRoute.post(CREATE_METERRECORD,  verifyToken, vaildateCreateMeterRecord, checkAccess([roles.SUPERADMIN,roles.ADMIN]), createMeterRecord);
adminRoute.put(UPDATE_METERRECORD,  verifyToken, vaildateUpdateMeterRecord, checkAccess([roles.SUPERADMIN,roles.ADMIN]), updateMeterRecord);
adminRoute.patch(DELETE_METERRECORD, verifyToken, checkAccess([roles.SUPERADMIN,roles.ADMIN]), deleteMeterRecord);
adminRoute.post('/fileupload',verifyToken,checkAccess([roles.SUPERADMIN,roles.ADMIN]),upload.single('file'),fileHandler)

export default adminRoute;


