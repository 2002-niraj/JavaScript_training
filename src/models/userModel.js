import { executeQuery } from "../helper/helper.js";


const getUserDetails = async (email) => {
  const query =
    "select id,name,email,password,role_id,contact,address,city from user_details where email = ? and is_deleted =0";
  const result = await executeQuery(query, [email]);
  return result;
};

const registerUserInDB = async (userDetails, hashedPassword, created_by) => {
  const { name, email, contact, city, address } = userDetails;
  
  const query =
    "INSERT INTO user_details (name, email, password, contact, city, address, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
  const result = await executeQuery(query, [
    name,
    email,
    hashedPassword,   
    contact,
    city,
    address,
    created_by,
    created_by
  ]);
  
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
  const query = `select mr.reading_date,mr.reading_value,b.billing_amount,b.is_paid from user_details ud join user_meter_mapping umm on ud.id  = umm.user_id 
join meter m on umm.meter_id  = m.id 
join meter_reading mr on umm.id = mr.user_meter_id join billing b on mr.id = b.meter_reading_id 
where ud.id  = ? and m.meter_number = ? AND ud.is_deleted = 0`;

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
  getMeterNumberFromDB,
  getUserDetails,
  userMeterMapping,
  getMeterNumber,getUserMeterReading,createMeterInDB
};
