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
import { validateCreateMeterRecord, validateUpdateMeterRecord} from '../middleware/meterRecordVaildation.js'

import verifyTokenAndCheckAccess from '../middleware/verifyTokenAndCheckAccess.js';

const adminRoute = (app)=>{
  app.get(GET_ALL_USERS, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), getAllusers);
  app.post(CREATE_USER, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), vaildateCreateUser, createUser);
  app.put(UPDATE_USER,verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]),vaildateUpdateUser, updateUser);
  app.patch(DELETE_USER, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), deleteUser);
  app.patch(CHANGE_ROLE, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), changeUserRole);

  app.post(CREATE_METER,verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), createMeter)
  app.get(GET_ALL_METERRECORD, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), getAllMeterRecord);

  app.post(CREATE_METERRECORD,  verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]),validateCreateMeterRecord, createMeterRecord);
  app.put(UPDATE_METERRECORD,  verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]),  validateUpdateMeterRecord, updateMeterRecord);
  app.patch(DELETE_METERRECORD, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]), deleteMeterRecord);
  app.post(FILE_UPLOAD, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN]),upload.single('file'),fileHandler);
}

export default adminRoute;


