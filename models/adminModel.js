import { executeQuery } from "../helper/helper.js";

const getAllUserFromDB = async () => {
  const query = `select id,name,email,contact,city,address,role_id,created_at,created_by,updated_at,updated_by from user_details
    where is_deleted = 0;`;
  const result = await executeQuery(query);
  return result;
};

const updateUserInDB = async (
  name,
  email,
  contact,
  city,
  address,
  updated_by,
  id
) => {
  const query = `update user_details
    set name=?,email=?,contact=?,city=?,address=?,updated_by=? where id=?`;
  const result = executeQuery(query, [
    name,
    email,
    contact,
    city,
    address,
    updated_by,
    id,
  ]);
  return result;
};
const getUserByIdFromDB = async (id) => {
  const query =
    "select id,name,contact,city,address,created_by from user_details where id = ? and is_deleted = 0";
  const result = await executeQuery(query, [id]);
  return result;
};

const deleteEventFromDB = async (id) => {
  const query = "update user_details set is_deleted  = 1 where id = ?";
  const result = await executeQuery(query, [id]);
  return result;
};

const changeRoleInDB = async (id, role_id) => {
  const query = "update user_details set role_id = ? where id = ?";
  const result = await executeQuery(query, [role_id, id]);
  return result;
};

const getMeterNumber = async (meter_number) => {
  const query = `select id,meter_number,is_deleted from meter where meter_number = ?`;
  const result = await executeQuery(query, [meter_number]);
  return result;
};
const getMeterRecordFromDB = async () => {
  const query = ` select umm.user_id ,m.meter_number,mr.reading_value,mr.reading_date,b.billing_amount,b.is_paid from meter_reading mr join billing b 
 on mr.id  = b.meter_reading_id join user_meter_mapping umm on mr.user_meter_id  = umm.id
 join meter m on umm.meter_id  = m.id where mr.is_deleted =0`;
  const result = await executeQuery(query);
  return result;
};

const createMeterRecordInDB = async (
  user_meter_id,
  reading_value,
  reading_date,
  email
) => {
  const query = `insert into meter_reading (user_meter_id,reading_value,reading_date,created_by,updated_by)
     values (?,?,?,?,?)`;
  const result = await executeQuery(query, [
    user_meter_id,
    reading_value,
    reading_date,
    email,
    email,
  ]);
  return result;
};

const updateMeterRecordInDB = async (
  reading_value,
  reading_date,
  updated_by,
  id
) => {
  const query = `update meter_reading set reading_value=?,reading_date=?,updated_by=?
     where id=?`;
  const result = await executeQuery(query, [
    reading_value,
    reading_date,
    updated_by,
    id,
  ]);
  return result;
};

const deleteReadingFromDB = async (id) => {
  const query = "update meter_reading set is_deleted = 1 where id =?";
  const result = await executeQuery(query, [id]);
  return result;
};

const getreadingByIdFromDB = async (id) => {
  const query = "select * from reading where id = ? and is_deleted = 0";
  const result = await executeQuery(query, [id]);
  return result;
};

const getMeterRecordByIdandDate = async (user_id, reading_date) => {
  const query = "select * from reading where user_id=? and reading_date=?";
  const result = await executeQuery(query, [user_id, reading_date]);
  return result;
};

const restoreMeterInDB = async (user_id, reading_value, reading_date, id) => {
  const query = `update reading set user_id = ?, reading_value = ? , reading_date = ?
     where id=?`;
  const result = await executeQuery(query, [
    user_id,
    reading_value,
    reading_date,
  ]);
  return result;
};

const getMeterNumberFromId = async (id) => {
  const query = ` select * from meter where id = ?`;
  const result = await executeQuery(query, [id]);
  return result;
};

const getSpecificMeterRecord = async (user_id, meter_id, reading_date) => {
  const query = `select umm.user_id ,m.meter_number,mr.reading_value,mr.reading_date,b.billing_amount,b.is_paid from meter_reading mr join billing b 
 on mr.id  = b.meter_reading_id join user_meter_mapping umm on mr.user_meter_id  = umm.id join meter m on umm.meter_id  = m.id where mr.is_deleted =0 and umm.user_id = ? and umm.meter_id = ?
 and  mr.reading_date = ?`;
  const result = await executeQuery(query, [user_id, meter_id, reading_date]);
  return result;
};

const getUserMapping = async (user_id, meter_id) => {
  const query = `select * from user_meter_mapping umm where user_id = ? and meter_id = ?`;
  const result = await executeQuery(query, [user_id, meter_id]);
  return result;
};

const createBillingRecordInDB = async (
  meter_reading_id,
  billing_amount,
  email
) => {
  const query = `insert into billing (meter_reading_id,billing_amount,created_by,updated_by)
values (?,?,?,?)`;

  const result = await executeQuery(query, [
    meter_reading_id,
    billing_amount,
    email,
    email,
  ]);
  return result;
};


const getMeterRecordPerMonth = async (user_id,meter_id,reading_date) => {

  const query = ` select * from meter_reading where
  user_meter_id = (
  select id from user_meter_mapping where user_id = ? and meter_id = ?)
  and YEAR(reading_date) = YEAR(?)  and MONTH(reading_date) = MONTH(?)`;
  const result = await executeQuery(query,[user_id,meter_id,reading_date,reading_date]);
  return result;
};

const getUserMeterId = async(id)=>{

 const query = `select umm.meter_id,umm.user_id from meter_reading mr join user_meter_mapping umm 
on mr.user_meter_id  = umm.id  where mr.id  = ?`;
 const result = await executeQuery(query,[id]);
 return result;
}

const updateBillingRecordInDB = async(reading_value,updated_by,meter_reading_id)=>{
   const query = `update billing  set billing_amount = ? ,updated_by = ? where meter_reading_id = ?`;
   const result = await executeQuery(query,[reading_value,updated_by,meter_reading_id]);
   return result;
}

export {
  getAllUserFromDB,
  updateUserInDB,
  getUserByIdFromDB,
  deleteEventFromDB,
  changeRoleInDB,
  getMeterRecordFromDB,
  createMeterRecordInDB,
  updateMeterRecordInDB,
  deleteReadingFromDB,
  getreadingByIdFromDB,
  getMeterRecordByIdandDate,
  restoreMeterInDB,
  getMeterNumberFromId,
  getMeterNumber,
  getSpecificMeterRecord,
  getUserMapping,
  createBillingRecordInDB,
  getMeterRecordPerMonth,getUserMeterId,updateBillingRecordInDB
};
