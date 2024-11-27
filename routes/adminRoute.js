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
  deleteMeterRecord,
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

const adminRoute = express.Router();

adminRoute.get(GET_ALL_USERS, verifyToken, getAllusers);
adminRoute.post(CREATE_USER, verifyToken, createUser);
adminRoute.put(UPDATE_USER, verifyToken, updateUser);
adminRoute.patch(DELETE_USER, verifyToken, deleteUser);
adminRoute.patch(CHANGE_ROLE, verifyToken, changeUserRole);

adminRoute.get(GET_ALL_METERRECORD, verifyToken, getAllMeterRecord);
adminRoute.post(CREATE_METERRECORD, verifyToken, createMeterRecord);
adminRoute.put(UPDATE_METERRECORD, verifyToken, updateMeterRecord);
adminRoute.patch(DELETE_METERRECORD, verifyToken, deleteMeterRecord);

export default adminRoute;
