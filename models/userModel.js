import { executeQuery } from "../helper/helper.js";

const getUserFromDB = async (email) => {
  const query = "select * from user_details where email = ?";
  const result = await executeQuery(query, [email]);
  return result;
};

const getUserForLogin = async (email) => {
  const query =
    "select id,name,email,password,role_id,contact,address,city from user_details where email = ? and is_deleted =0";
  const result = await executeQuery(query, [email]);
  return result;
};

const restoreUserInDB = async (
  id,
  name,
  email,
  password,
  contact,
  city,
  address,
  created_by
) => {
  const query = `update user_details
  set name=?, email=?,password=?,contact=?,city=?,address=?,created_by=?,updated_by=?,
  is_deleted = 0 where id = ?`;
  const result = await executeQuery(query, [
    name,
    email,
    password,
    contact,
    city,
    address,
    created_by,
    created_by,
    id,
  ]);
  return result;
};

const restoreMeterInDB = async (id, meter_number, email) => {
  const query = `update meter set meter_number = ?,created_by=?,updated_by=?
  where id=?`;
  const result = await executeQuery(query, [meter_number, email, email, id]);
  return result;
};

const registerUserInDB = async (
  name,
  email,
  password,
  contact,
  city,
  address,
  created_by
) => {
  
  const query =
    "insert into user_details (name,email,password,contact,city,address,created_by,updated_by) values (?,?,?,?,?,?,?,?)";
  const result = await executeQuery(query, [
    name,
    email,
    password,
    contact,
    city,
    address,
    created_by,
    created_by,
  ]);
  return result;
};



const addInMeter = async (meter_number, email) => {
  const query =
    "insert into meter (meter_number,created_by,updated_by) values (?,?,?)";
  const result = await executeQuery(query, [meter_number, email, email]);
  return result;
};

const getMeterNumberFromDB = async (meter_number) => {
  const query = " select meter_number from meter where meter_number = ? ";
  const result = await executeQuery(query, [meter_number]);
  return result;
};


const userMeterMapping = async (user_id, meter_id, created_by) => {
  const query = `insert into user_meter_mapping(user_id,meter_id,created_by,updated_by)
  value (?,?,?,?)`;
  const result = await executeQuery(query, [
    user_id,
    meter_id,
    created_by,
    created_by,
  ]);
  return result;
};

const getMeterNumber = async (user_id) => {
  const query = `select m.meter_number from user_details ud join user_meter_mapping umm on ud.id = umm.user_id 
join meter m on umm.meter_id  = m.id where ud.id = ?`;
const result = await executeQuery(query,[user_id]);
return result;
};

const getUserMeterReading = async(user_id,meter_number)=>{
  const query = `select mr.user_meter_id ,mr.reading_value,mr.reading_date from user_details ud join user_meter_mapping umm on ud.id  = umm.user_id 
join meter m on umm.meter_id  = m.id join meter_reading mr on umm.id = mr.user_meter_id 
where ud.id  = ? and m.meter_number = ?`;

const result = await executeQuery(query,[user_id,meter_number]);
return result;
}

const createMeterInDB = async(meter_number,created_by)=>{
  const query = `insert into meter (meter_number,created_by,updated_by)
  values (?,?,?)`;
  const result = await executeQuery(query,[meter_number,created_by,created_by]);
  return result;

}

export {
  registerUserInDB,
  getUserFromDB,
  addInMeter,
  getMeterNumberFromDB,
  getUserForLogin,
  restoreUserInDB,
  restoreMeterInDB,
  userMeterMapping,
  getMeterNumber,getUserMeterReading,createMeterInDB
};
