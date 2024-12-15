import express from 'express';
import { registerUser ,loginUser,userMeterRecord,userProfile} from '../controllers/userController.js';
import constant from '../constant/constant.js'
import { vaildateCreateUser } from '../middleware/userVaildation.js';
import verifyTokenAndCheckAccess from '../middleware/verifyTokenAndCheckAccess.js';

const {SUPERADMIN,ADMIN,USER} = constant.roles

const {REGISTER_USER, LOGIN_USER ,METER_READINGS,USER_PROFILE} = constant.routes

const userRoute = express.Router();
userRoute.post(REGISTER_USER,vaildateCreateUser,registerUser);
userRoute.post(LOGIN_USER,loginUser);
userRoute.get(METER_READINGS, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN,USER]), userMeterRecord);
userRoute.get(USER_PROFILE,verifyTokenAndCheckAccess([SUPERADMIN,ADMIN,USER]),userProfile);

export default userRoute;