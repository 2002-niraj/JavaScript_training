import express from "express";
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
  CREATE_METER,FILE_UPLOAD
} = constant.routes;

const {SUPERADMIN,ADMIN} = constant.roles

import upload from "../config/fileUpload.js";
import { vaildateCreateUser,vaildateUpdateUser } from '../middleware/userVaildation.js';
import { vaildateCreateMeterRecord ,vaildateUpdateMeterRecord} from '../middleware/meterRecordVaildation.js'

import verifyTokenAndCheckAccess from '../middleware/verifyTokenAndCheckAccess.js';

const adminRoute = express.Router();

adminRoute.get(GET_ALL_USERS, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), getAllusers);
adminRoute.post(CREATE_USER, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), vaildateCreateUser, createUser);
adminRoute.put(UPDATE_USER,verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]),vaildateUpdateUser, updateUser);
adminRoute.patch(DELETE_USER, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), deleteUser);
adminRoute.patch(CHANGE_ROLE, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), changeUserRole);

adminRoute.post(CREATE_METER,verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), createMeter)
adminRoute.get(GET_ALL_METERRECORD, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), getAllMeterRecord);

adminRoute.post(CREATE_METERRECORD,  verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), vaildateCreateMeterRecord, createMeterRecord);
adminRoute.put(UPDATE_METERRECORD,  verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), vaildateUpdateMeterRecord, updateMeterRecord);
adminRoute.patch(DELETE_METERRECORD, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), deleteMeterRecord);
adminRoute.post(FILE_UPLOAD, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]),upload.single('file'),fileHandler)

export default adminRoute;


