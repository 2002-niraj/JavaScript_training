import express from 'express';
import { registerUser ,loginUser,profileUser} from '../controllers/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import constant from '../constant/constant.js'
import { vaildateCreateUser } from '../middleware/userVaildation.js';
const {REGISTER_USER, LOGIN_USER ,PROFILE_USER} = constant.routes

const userRoute = express.Router();
userRoute.post(REGISTER_USER,vaildateCreateUser,registerUser);
userRoute.post(LOGIN_USER,loginUser);
userRoute.get(PROFILE_USER, verifyToken, profileUser)


export default userRoute;