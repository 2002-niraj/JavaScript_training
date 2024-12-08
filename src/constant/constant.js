const constants = {
  routes: {
    REGISTER_USER: '/register/user',
    LOGIN_USER: '/login/user',
    METER_READINGS: '/meterReading/user/:meter_number',
    GET_ALL_USERS: '/users',
    CREATE_USER: '/user/create',
    UPDATE_USER: '/user/:id',
    DELETE_USER: '/user/:id',
    CHANGE_ROLE: '/user/changeRole/:id',
    GET_ALL_METERRECORD: '/meterRecord',
    CREATE_METERRECORD: '/meterRecord/createMeterRecord',
    UPDATE_METERRECORD: '/meterRecord/:id',
    DELETE_METERRECORD: '/meterRecord/:id',
    USER_PROFILE: '/profile/user/:user_id',
    CREATE_METER: '/createMeter',
    FILE_UPLOAD: '/fileupload'
  },

  messages: {
    error: {
      USER_ALREADY_EXISTS: 'This email is already exists',
      METER_ALREADY_EXISTS: 'Meter number already registered',
      ERROR_IN_METER: 'Error in registering meter',
      ERROR_IN_REGISTER: 'Error in registration',
      ERROR_IN_METER_RECORD: 'Error in creating meter record!',
      ERROR_IN_USER_METER_MAP: 'Error in creating user_meter_map',
      ACCOUNT_NOT_EXISTS: 'Account not found, please register',
      WRONG_PASSWORD: 'Wrong password',
      USER_NOT_FOUND: 'User not found',
      METER_NOT_FOUND: 'Meter record not found',
      ER_DUP_ENTRY: 'Record already exists',
      USER_DETAILS_NOT_FOUND: 'User details not found',
      ROLE_NOT_EXISTS: 'Role does not exist',
      ROLE_NOT_CHANGED: 'Role is not changed',
      ROLE_CHANGED:"Role changed sucessfully!",
      USER_DETAILS_NOT_UPDATED: 'User details not updated',
      EMAIL_EXISTS: 'Email ID already exists',
      PERMISSION_DENIED: 'Access denied. You can\'t delete superadmin',
      USER_DETAILS_NOT_DELETED: 'User details not deleted',
      FILE_NOT_UPLOADED: 'No file uploaded',
      INVAILD_FILE: 'Invalid file type. Only CSV files are allowed.',
      VAILDATION_FAILED: 'Validation failed',
      METER_NOT_ALLOCATE_USER: 'This meter is not allocated to the current user',
      METER_RECORD_EXISTS: 'Meter record for this date already exists',
      METER_RECORD_EXISTS_MONTH: 'Meter record for this meter already exists for this month'
    },
    success: {
      REGISTER_SUCESS: 'User Registered Successfully',
      LOGIN_SUCESS: 'User logged in successfully',
      USER_PROFILE: 'User profile retrieved successfully',
      METER_READING:"User Meter readings retrived successfully",
      ROLE_CHANGED: 'Role changed successfully',
      USER_DETAILS_UPDATED: 'User details updated successfully',
      USER_DETAILS_DELETED: 'User details deleted successfully',
      FILE_PROCESSED: 'File processed successfully',
      METER_RECORD_SUCESS: 'Meter record created successfully!',
      USER_DETAILS:"User details retrieved successfully"
    }
  },

  codes: {
    success: {
      SUCCESS: 200,
      CREATED: 201
    },
    error: {
      INTERNAL_SERVER_ERROR: 500,
      NOT_FOUND: 404,
      BAD_REQUEST: 400,
      CONFLICT: 409,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      VALIDATION_FAILED: 422 
    }
  },

  middlewareConstant: {
    TOKEN_NOT_EXIST: 'Token does not exist',
    INVALID_TOKEN: 'Invalid token',
    ACCESS_DENIED: 'Access denied!'
  },

  dbConstant: {
    CONNECTION_FAILED: 'Database connection failed:',
    CONNECTION_SUCCESS: 'Connected to the MySQL database'
  },

  roles: {
    SUPERADMIN: 1,
    ADMIN: 2,
    USER: 3
  }
};

export default constants;
