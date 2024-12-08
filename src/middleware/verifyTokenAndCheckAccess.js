import jwt from 'jsonwebtoken'; 
import { errorHandler, sendErrorResponse } from "../helper/helper.js"; 
import constant from "../constant/constant.js"; 


const { UNAUTHORIZED, FORBIDDEN } = constant.codes.error;
const { TOKEN_NOT_EXIST, INVALID_TOKEN, ACCESS_DENIED } = constant.middlewareConstant;

const verifyTokenAndCheckAccess = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      
      if (!token) {
        throw errorHandler(TOKEN_NOT_EXIST, UNAUTHORIZED);
      }

      jwt.verify(token, process.env.SECRETKEY, (error, payload) => {
        if (error) {

          throw errorHandler(INVALID_TOKEN, UNAUTHORIZED);
        }

        req.user = payload;

        if (allowedRoles && !allowedRoles.includes(req.user.role_id)) {
      
          return res.status(FORBIDDEN).json({
            message: ACCESS_DENIED,
          });
        }

    
        next();
      });
    } catch (error) {
     
      sendErrorResponse(res, error);
    }
  };
};

export default verifyTokenAndCheckAccess; 
