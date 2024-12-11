import { registerUser ,loginUser,userMeterRecord,userProfile} from '../controllers/userController.js';
import constant from '../constant/constant.js'
import { vaildateCreateUser } from '../middleware/userVaildation.js';
import verifyTokenAndCheckAccess from '../middleware/verifyTokenAndCheckAccess.js';

const {SUPERADMIN,ADMIN,USER} = constant.roles

const {REGISTER_USER, LOGIN_USER ,METER_READINGS,USER_PROFILE} = constant.routes

const userRoute = (app)=>{
    app.post(REGISTER_USER,vaildateCreateUser,registerUser);
    app.post(LOGIN_USER,loginUser);
    app.get(METER_READINGS, verifyTokenAndCheckAccess([SUPERADMIN,ADMIN,USER]), userMeterRecord);
    app.get(USER_PROFILE,verifyTokenAndCheckAccess([SUPERADMIN,ADMIN,USER]),userProfile);
}
export default userRoute;