import { createError,sendErrorResponse } from "../helper/helper.js"
import jwt from 'jsonwebtoken';
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if(!token){
      throw createError("token is not exit",400);
    }
    jwt.verify(token,process.env.SECRETKEY,(error,payload)=>{

      if(error){
        throw createError("invalid token",401);
      }

      req.user = payload;
      next();
    })
    
  } catch (error) {

       sendErrorResponse(res,error);  
  }
};

export { verifyToken };
