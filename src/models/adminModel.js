import { executeQuery } from "../helper/helper.js";

const getAllUserFromDB = async (user_id,role_id) => {

  if(user_id === 1 && role_id === 1){
    const query = `select id,name,email,contact,city ,address,role_id,created_at,created_by from user_details where role_id !=1 and is_deleted = 0`;
    const result = await executeQuery(query);
    return result;
  }
  else{
    const query = `select id,name,email,contact,city ,address,role_id,created_at,created_by from user_details where id != ? and role_id not in (1,2) and is_deleted = 0`;
    const result = await executeQuery(query,[user_id]);
    return result;
  }
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
    "select id,name,email,contact,city,address,created_by from user_details where id = ? and is_deleted = 0";
  const result = await executeQuery(query, [id]);
  return result[0];
};

const deleteUserFromDB = async (id) => {
  const query = `UPDATE user_details
       SET is_deleted = 1
       WHERE id = ?`;
  const result = await executeQuery(query, [id]);
  return result;
};

const changeRoleInDB = async (id, role_id) => {
  const query = "update user_details set role_id = ? where id = ?";
  const result = await executeQuery(query, [role_id, id]);
  return result;
};

const getMeterRecordFromDB = async () => {
  const query = `select mr.reading_id, umm.user_id,ud.name ,m.meter_number,
    mr.reading_value,DATE_FORMAT(mr.reading_date,'%Y-%m-%d') as reading_date ,b.billing_amount,b.is_paid from 
    meter_reading mr join billing b ON mr.reading_id = b.meter_reading_id join 
    user_meter_mapping umm ON mr.user_meter_id = umm.id join meter m ON umm.meter_id = m.id join user_details ud ON umm.user_id = ud.id  
where mr.is_deleted = 0`;
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
     where reading_id=?`;
  const result = await executeQuery(query, [
    reading_value,
    reading_date,
    updated_by,
    id,
  ]);
  return result;
};

const deleteReadingFromDB = async (id) => {
  const query = "update meter_reading set is_deleted = 1 where reading_id =?";
  const result = await executeQuery(query, [id]);
  return result;
};

const getreadingByIdFromDB = async (id) => {
  const query = "select * from meter_reading where reading_id = ? and is_deleted = 0";
  const result = await executeQuery(query, [id]);
  return result;
};

const getreadingForUpdate = async(id)=>{
  const query = `select mr.reading_id,umm.user_id,umm.meter_id,m.meter_number,DATE_FORMAT(mr.reading_date, '%Y-%m-%d') as reading_date, mr.reading_value ,b.billing_amount,b.is_paid from 
    meter_reading mr join billing b ON mr.reading_id = b.meter_reading_id join 
    user_meter_mapping umm ON mr.user_meter_id = umm.id join meter m ON umm.meter_id = m.id
join user_details ud ON umm.user_id = ud.id  where mr.is_deleted = 0 and mr.reading_id = ?`;
const result = await executeQuery(query,[id]);
return result;

}

const getMeterIdFromNumber = async(meter_number)=>{
  const query = ` select id from meter where meter_number =?`;
  const result = await executeQuery(query,[meter_number]);
  return result;
}

const getSpecificMeterRecord = async (user_id, meter_id, reading_date) => {
  const query = `select umm.user_id ,m.meter_number,mr.reading_value,mr.reading_date,b.billing_amount,b.is_paid from meter_reading mr join billing b 
 on mr.reading_id  = b.meter_reading_id join user_meter_mapping umm on mr.user_meter_id  = umm.id join meter m on umm.meter_id  = m.id where mr.is_deleted =0 and umm.user_id = ? and umm.meter_id = ?
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
  is_paid,
  email
) => {
  const query = `insert into billing (meter_reading_id,billing_amount, is_paid,created_by,updated_by)
values (?,?,?,?,?)`;

  const result = await executeQuery(query, [
    meter_reading_id,
    billing_amount,
    is_paid,
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

const updateBillingRecordInDB = async(reading_value,is_paid,updated_by,meter_reading_id)=>{
   const query = `update billing  set billing_amount = ? ,is_paid = ?, updated_by = ? where meter_reading_id = ?`;
   const result = await executeQuery(query,[reading_value,is_paid,updated_by,meter_reading_id]);
   return result;
}

const getReadingByUserMeterId = async(id,user_meter_id)=>{
  const query = `select reading_date from meter_reading where user_meter_id = ? and reading_id !=id`;
  const result = await executeQuery(query,[user_meter_id,id]);
  return result;
}

const getCountMeterNumber = async(user_id)=>{
   const query = `select COUNT(m.meter_number) AS meter_count
FROM user_meter_mapping umm
JOIN meter m ON umm.meter_id = m.id
WHERE umm.user_id = ?
  AND umm.is_deleted = 0
  AND m.is_deleted = 0`;

  const result = await executeQuery(query,[user_id]);
  return result[0];
}

const getRecordSameMonth = async(user_id,meter_id,reading_date,id)=>{
  const query = `select mr.reading_id,umm.user_id,umm.meter_id,m.meter_number,DATE_FORMAT(mr.reading_date, '%Y-%m-%d') as reading_date, mr.reading_value ,b.billing_amount,b.is_paid from 
    meter_reading mr join billing b ON mr.reading_id = b.meter_reading_id join user_meter_mapping umm ON mr.user_meter_id = umm.id join meter m ON umm.meter_id = m.id
join user_details ud ON umm.user_id = ud.id  where mr.is_deleted = 0 and umm.user_id = ? and umm.meter_id = ? and date_format(reading_date,'%Y-%m') = date_format(?,'%Y-%m') and  mr.reading_id != ?`;
  const result = await executeQuery(query,[user_id,meter_id,reading_date,id]);
  return result;
}

export {
  getAllUserFromDB,
  updateUserInDB,
  getUserByIdFromDB,
  deleteUserFromDB,
  changeRoleInDB,
  getMeterRecordFromDB,
  createMeterRecordInDB,
  updateMeterRecordInDB,
  deleteReadingFromDB,
  getreadingByIdFromDB,
  getSpecificMeterRecord,
  getUserMapping,
  createBillingRecordInDB, getMeterIdFromNumber,getreadingForUpdate,getRecordSameMonth,
  getMeterRecordPerMonth,updateBillingRecordInDB,getReadingByUserMeterId,getCountMeterNumber
};
