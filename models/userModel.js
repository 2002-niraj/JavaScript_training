import { executeQuery } from "../helper/helper.js";

const getUserFromDB = async (email) => {
  const query =
    "select id,name,email,password,role_id,contact from user_details where email = ?";
  const result = await executeQuery(query, [email]);
  return result;
};

const registerUserInDB = async (name, email, password, contact, city,address,meter_id,created_by,updated_by) => {
  const query =
    "insert into user_details (name,email,password,contact,city,address,meter_id,created_by,updated_by) values (?,?,?,?,?,?,?,?,?)";
  const result = await executeQuery(query, [
    name,
    email,
    password,
    contact,
    city,
    address,
    meter_id,
    created_by,updated_by
  ]);
  return result;
};

const getUserDetails = async (user_id) => {
  const query = "select id,name,meter_id,email,city,role_id, address from user_details where id = ?";
  const result = await executeQuery(query,user_id);
  return result;
};

const addInMeter = async(meter_number,created_by,updated_by)=>{

const query = 'insert into meter (meter_number,created_by,updated_by) values (?,?,?)';
const result = await executeQuery(query,[meter_number,created_by,updated_by]);
return result;
}

const getMeterNumberFromDB = async(meter_number)=>{
  const query = " select meter_number from meter where meter_number = ?"
  const result = await executeQuery(query,[meter_number]);
  return result;
}

const getMeterNumberFromID = async(id)=>{
  const query = " select meter_number from meter where id = ?"
  const result = await executeQuery(query,[id]);
  return result;
}

const getReadingByUserID = async(id)=>{
  const query = "select reading_value,reading_date from reading where user_id = ?"
  const result = await executeQuery(query,[id]);
  return result;
}


export { registerUserInDB, getUserFromDB, getUserDetails,addInMeter ,getMeterNumberFromDB,getMeterNumberFromID,getReadingByUserID};
