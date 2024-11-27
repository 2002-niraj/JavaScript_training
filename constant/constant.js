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
      
    },
  
    codes: {
      SUCCESS: 200,
      CREATED: 201,
      INTERNAL_SERVER_ERROR: 500,
      NOT_FOUND: 404,
      BAD_REQUEST: 400,
    }
  };
  
  export default constants;