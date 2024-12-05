
import constant from "../constant/constant.js";
const {ACCESS_DENIED } = constant.middlewareConstant;


const { FORBIDDEN} = constant.codes;
const checkAccess = (allowedRoles)=>{
  return (req,res,next) =>{
    const {role_id} = req.user;
    if(!allowedRoles.includes(role_id)){
        return res.status(FORBIDDEN).json({
            message:ACCESS_DENIED
        });
    }
    next();
  }
}

export default checkAccess;



