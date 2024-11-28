import { executeQuery } from "../helper/helper.js";


const getAllUserFromDB = async()=>{

    const query = `select e1.id,e1.name,e1.email ,e1.contact ,e1.city ,e1.address ,e1.role_id ,e2.meter_number from user_details as e1 
join meter as e2 on e1.meter_id = e2.id  where e1.is_deleted = 0`
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
    
      const query = "select user_id,reading_value,DATE_FORMAT(reading_date,'%Y-%m-%d') as reading_date from reading where is_deleted=0";
      const result = await executeQuery(query);
      return result;
}

const createMeterInDB = async(user_id,reading_value,reading_date,email)=>{

    const query = `insert into reading (user_id,reading_value,reading_date,created_by,updated_by)
     values (?,?,?,?,?)`;
    const result = await executeQuery(query,[user_id,reading_value,reading_date,email,email]);
    return result;
}

const updateMeterRecordInDB = async(user_id,reading_value,reading_date,updated_by,id)=>{
   
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



export {getAllUserFromDB,updateUserInDB,getUserByIdFromDB,deleteEventFromDB,changeRoleInDB,getMeterRecordFromDB,createMeterInDB,updateMeterRecordInDB,deleteReadingFromDB,getreadingByIdFromDB}