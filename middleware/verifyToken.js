import {  errorHandler,sendErrorResponse } from "../helper/helper.js"
import jwt from 'jsonwebtoken';
import constant from "../constant/constant.js";
const {BAD_REQUEST} = constant.codes
const {INVAILD_TOKEN,TOKEN_NOT_EXIT} = constant.middlewareConstant

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if(!token){
      throw  errorHandler(TOKEN_NOT_EXIT,BAD_REQUEST);
    }
    jwt.verify(token,process.env.SECRETKEY,(error,payload)=>{

      if(error){
        throw  errorHandler(INVAILD_TOKEN,BAD_REQUEST);
      }

      req.user = payload;
      next();
    })
    
  } catch (error) {

       sendErrorResponse(res,error);  
  }
};

export { verifyToken };
