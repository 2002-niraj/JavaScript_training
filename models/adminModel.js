import { executeQuery } from "../helper/helper.js";


const getAllUserFromDB = async()=>{

    const query = `select id,name,email,contact,city,address,role_id,created_at,created_by,updated_at,updated_by from user_details
    where is_deleted = 0;`
    const result = await executeQuery(query);
    return result;
}

const updateUserInDB = async(name,email,contact,city,address,updated_by,id)=>{
    const query = `update user_details
    set name=?,email=?,contact=?,city=?,address=?,updated_by=? where id=?`;
    const result = executeQuery(query,[name,email,contact,city,address,updated_by,id]);
    return result;
 }
const getUserByIdFromDB = async(id)=>{
        
    const query = 'select * from user_details where id = ? and is_deleted = 0';
    const result = await executeQuery(query,[id]);
    return result;
}

const deleteEventFromDB = async(id)=>{

    const query = "update user_details set is_deleted  = 1 where id = ?";
    const result = await executeQuery(query, [id]);
    return result
}

const changeRoleInDB = async(id,role_id)=>{
    const query = "update user_details set role_id = ? where id = ?";
    const result = await executeQuery(query,[role_id,id]);
    return result;
}
const getMeterRecordFromDB = async()=>{

      const query = `select r.id, m.id as meter_id, m.meter_number,r.user_id,r.reading_value, DATE_FORMAT(r.reading_date,'%Y-%m-%d') as reading_date
from meter as m left join reading as r  on m.id = r.meter_id
where m.is_deleted =0`
      const result = await executeQuery(query);
      return result;
}

const createMeterRecordInDB= async(user_id,meter_id,reading_value,reading_date,email)=>{

    const query = `insert into reading (user_id,meter_id,reading_value,reading_date,created_by,updated_by)
     values (?,?,?,?,?,?)`;
    const result = await executeQuery(query,[user_id,meter_id,reading_value,reading_date,email,email]);
    return result;
}

const updateMeterRecordInDB = async( user_id,reading_value,reading_date,updated_by,id)=>{
   
     const query = `update reading set user_id=?,reading_value=?,reading_date=?,updated_by=?
     where id=?`;
     const result = await executeQuery(query,[user_id,reading_value,reading_date,updated_by,id]);
     return result;
}


const deleteReadingFromDB = async(id)=>{
  const query = 'update reading set is_deleted = 1 where id =?';
  const result = await executeQuery(query,[id]);
  return result;
}

const getreadingByIdFromDB = async(id)=>{
        
    const query = 'select * from reading where id = ? and is_deleted = 0';
    const result = await executeQuery(query,[id]);
    return result;
}

const getMeterRecordByIdandDate = async(user_id,reading_date)=>{
    
      const query = 'select * from reading where user_id=? and reading_date=?'
      const result = await executeQuery(query,[user_id,reading_date]);
      return result;
}

const restoreMeterInDB = async(user_id,reading_value,reading_date,id)=>{
          
    const query = `update reading set user_id = ?, reading_value = ? , reading_date = ?
     where id=?`;
     const result = await executeQuery(query,[user_id,reading_value,reading_date]);
     return result;
}

const createMeterInDB = async(meter_number,created_by)=>{
    const query = `insert into meter (meter_number,created_by,updated_by)
    values (?,?,?)`;
    const result = await executeQuery(query,[meter_number,created_by,created_by]);
    return result;

}

const getMeterNumberFromDB = async(meter_number,user_id)=>{
    const query = `select * from meter where  meter_number = ? and user_id = ?`;
    const result = await executeQuery(query,[meter_number,user_id]);
    return result;
}



export {getAllUserFromDB,updateUserInDB,getUserByIdFromDB,deleteEventFromDB,changeRoleInDB,getMeterRecordFromDB,createMeterRecordInDB,updateMeterRecordInDB,deleteReadingFromDB,getreadingByIdFromDB,getMeterRecordByIdandDate,createMeterInDB,restoreMeterInDB,getMeterNumberFromDB}