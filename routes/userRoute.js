import express from 'express';
import { registerUser ,loginUser,profileUser} from '../controllers/userController.js';
import { verifyToken } from '../middleware/verifyToken.js';
const userRoute = express.Router();
userRoute.post('/register/user',registerUser);
userRoute.post('/login/user',loginUser);
userRoute.get('/profile/user', verifyToken, profileUser)


export default userRoute;