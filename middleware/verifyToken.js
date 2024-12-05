import {  errorHandler,sendErrorResponse } from "../helper/helper.js"
import jwt from 'jsonwebtoken';
import constant from "../constant/constant.js";
const {UNAUTHORIZED} = constant.codes
const {INVAILD_TOKEN,TOKEN_NOT_EXIT} = constant.middlewareConstant

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if(!token){
      throw  errorHandler(TOKEN_NOT_EXIT,UNAUTHORIZED);
    }
    jwt.verify(token,process.env.SECRETKEY,(error,payload)=>{

      if(error){
        throw  errorHandler(INVAILD_TOKEN,UNAUTHORIZED);
      }

      req.user = payload;
      next();
    })
    
  } catch (error) {

       sendErrorResponse(res,error);  
  }
};

export { verifyToken };
