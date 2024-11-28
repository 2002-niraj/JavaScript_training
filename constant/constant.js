const constants = {
    routes: {
      REGISTER_USER:'/register/user',
      LOGIN_USER:'/login/user',
      PROFILE_USER:'/profile/user',
      GET_ALL_USERS:'/users',
      CREATE_USER:'/user/create',
      UPDATE_USER:'/user/:id',
      DELETE_USER:'/user/:id',
      CHANGE_ROLE:'/user/changeRole/:id',
      GET_ALL_METERRECORD:'/meterRecord',
      CREATE_METERRECORD:'/meterRecord/createMeterRecord',
      UPDATE_METERRECORD:'/meterRecord/:id',
      DELETE_METERRECORD:'/meterRecord/:id'
    },
  
    messages: {
      USER_ALREADY_EXIT:'this email is already exits',
      METER_ALREADY_EXIT:'meter number already registered',
      ERROR_IN_METER:'error in registering meter',
      ERROR_IN_REGISTER:'error in registeration',
      REGISTER_SUCESS:'user Registered sucessfully',
      ACCOUNT_NOT_EXITS:'account not found please register',
      WRONG_PASSWORD:'wrong passoword',
      LOGIN_SUCESS:'user logged in successfully',
      USER_NOT_FOUND:'user not found',
      METER_NOT_FOUND:'meter not found for user',
      USER_PROFILE:'user profile',
      ER_DUP_ENTRY:'Record already exits'
    },
  
    codes: {
      SUCCESS: 200,
      CREATED: 201,
      INTERNAL_SERVER_ERROR: 500,
      NOT_FOUND: 404,
      BAD_REQUEST: 400,
    },
    middlewareConstant:{
              TOKEN_NOT_EXIT:'token is not exit',
      INVAILD_TOKEN:'invalid token'
    },
    dbConstant:{
     CONNECTION_FAILED:'Database connection failed:',
     CONNECTION_SUCESS:'Connected to the MySQL database'
    }
  };
  
  export default constants;