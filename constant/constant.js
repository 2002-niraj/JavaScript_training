const constants = {
    routes: {
      REGISTER_USER:'/register/user',
      LOGIN_USER:'/login/user',
      METER_READINGS:'/meterReading/user/:meter_number',
      GET_ALL_USERS:'/users',
      CREATE_USER:'/user/create',
      UPDATE_USER:'/user/:id',
      DELETE_USER:'/user/:id',
      CHANGE_ROLE:'/user/changeRole/:id',
      GET_ALL_METERRECORD:'/meterRecord',
      CREATE_METERRECORD:'/meterRecord/createMeterRecord',
      UPDATE_METERRECORD:'/meterRecord/:id',
      DELETE_METERRECORD:'/meterRecord/:id',
      USER_PROFILE:'/profile/user/:user_id',
      CREATE_METER:'/createMeter',
      FILE_UPLOAD:'/fileupload'
    },
  
    messages: {
      USER_ALREADY_EXIT:'This email is already exits',
      METER_ALREADY_EXIT:'Meter number already registered',

      ERROR_IN_METER:'Error in registering meter',
      ERROR_IN_REGISTER:'Error in registeration',
      ERROR_IN_METER_RECORD:'Error in creating meter record!',
      ERROR_IN_USER_METER_MAP:'Error in creating user_meter_map',

      REGISTER_SUCESS:'User Registered Sucessfully',
      ACCOUNT_NOT_EXITS:'Account not found please register',
      WRONG_PASSWORD:'Wrong passoword',
      LOGIN_SUCESS:'User logged in successfully',
      USER_NOT_FOUND:'User not found',
      METER_NOT_FOUND:'Meter record not found',
      USER_PROFILE:'User profile',
      ER_DUP_ENTRY:'Record already exits',
      USER_EXISTS:'User already exists',
      USERDETAILS_NOT_FOUND:'User details not found',
      USER_PROFILE:"User Profile",
      METER_READING:"Meter readings",
      ROLE_NOT_EXISTS:"Role not exists",
      ROLE_CHANGED:"Role changed sucessfully",
      ROLE_NOT_CHANGED:"Role is not changed",
      USER_DETAILS_UPDATED:"User details updated sucessfully",
      USER_DETAILS_NOT_UPDATED:"User details not updated",
      EMAIL_EXISTS:"Email id already exists",
      PERMISSION_DENIED :"Access denied you can't delete superadmin",
      USER_DETAILS_DELETED:"User details deleted sucessfully",
      USER_DETAILS_NOT_DELETED:"User Details not deleted",
      FILE_NOT_UPLOADED:"No file uploaded",
      INVAILD_FILE:"Invalid file type Only csv files are allowed.",
      VAILDATION_FAILED:"Validation failed",
      FILE_PROCESSED:"File processed successfully",
       METER_NOT_ALLOCATE_USER:"This meter is not allocate to current user",
       METER_RECORD_EXISTS:"Meter record for this date already exists",
       METER_RECORD_EXISTS_MONTH:"Meter record for this meter already exists for this month",
       METER_RECORD_SUCESS:"Meter record created sucessfully!"
    },
  
    codes: {
      SUCCESS: 200,
      CREATED: 201,
      INTERNAL_SERVER_ERROR: 500,
      NOT_FOUND: 404,
      BAD_REQUEST: 400,
      CONFLICT:409,
      UNAUTHORIZED:401,
      FORBIDDEN:403
    },
    middlewareConstant:{
              TOKEN_NOT_EXIT:'Token is not exit',
      INVAILD_TOKEN:'Invalid token',
      ACCESS_DENIED:"Access denied!"
    },
    dbConstant:{
     CONNECTION_FAILED:'Database connection failed:',
     CONNECTION_SUCESS:'Connected to the MySQL database'
    }
    
  };


  
  export default constants;