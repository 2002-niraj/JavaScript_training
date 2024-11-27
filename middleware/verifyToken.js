import { createError,sendErrorResponse } from "../helper/helper.js"
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (typeof token !== "undefined") {
      req.token = token;
      next();
    } else {
      throw createError("token is not vaild",400)
    }
  } catch (error) {

       sendErrorResponse(res,error);  
  }
};

export { verifyToken };
