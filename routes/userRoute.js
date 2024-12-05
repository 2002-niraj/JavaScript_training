import express from 'express';
import { registerUser ,loginUser,userMeterRecord,userProfile} from '../controllers/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import constant from '../constant/constant.js'
import { vaildateCreateUser } from '../middleware/userVaildation.js';

const {REGISTER_USER, LOGIN_USER ,METER_READINGS,USER_PROFILE} = constant.routes

const userRoute = express.Router();
userRoute.post(REGISTER_USER,vaildateCreateUser,registerUser);
userRoute.post(LOGIN_USER,loginUser);
userRoute.get(METER_READINGS, verifyToken, userMeterRecord);
userRoute.get(USER_PROFILE,verifyToken,userProfile);

export default userRoute;