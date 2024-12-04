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
        
    const query = 'select id,name,contact,city,address,created_by from user_details where id = ? and is_deleted = 0';
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

const getMeterNumber = async(meter_number)=>{
    const query = `select id,meter_number,is_deleted from meter where meter_number = ?`;
    const result = await executeQuery(query,[meter_number]);
    return result;
}
const getMeterRecordFromDB = async()=>{

      const query = `select umm.user_id,umm.meter_id,mr.reading_value,mr.reading_date from 
      user_meter_mapping umm join meter_reading mr on umm.id = mr.user_meter_id 
      where mr.is_deleted =0`;
      const result = await executeQuery(query);
      return result;
}

const createMeterRecordInDB= async(user_id,meter_id,reading_value,reading_date,email)=>{
    const query = `insert into reading (user_id,meter_id,reading_value,reading_date,created_by,updated_by)
     values (?,?,?,?,?,?)`;
    const result = await executeQuery(query,[Number(user_id),meter_id,reading_value,reading_date,email,email]);
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



const meterExitsInDB = async(meter_number)=>{
    
    const query = `select distinct m.meter_number , r.user_id, r.meter_id from meter as m left join reading as r on m.id = r.meter_id 
where meter_number = ?`;
const result = await executeQuery(query ,[meter_number]);
return result;
}



export {getAllUserFromDB,updateUserInDB,getUserByIdFromDB,deleteEventFromDB,changeRoleInDB,getMeterRecordFromDB,createMeterRecordInDB,updateMeterRecordInDB,deleteReadingFromDB,getreadingByIdFromDB,getMeterRecordByIdandDate,restoreMeterInDB
    ,meterExitsInDB, getMeterNumber
}