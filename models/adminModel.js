import { executeQuery } from "../helper/helper.js";


const getAllUserFromDB = async()=>{

    const query = `select e1.id,e1.name,e1.email ,e1.contact ,e1.city ,e1.address ,e1.role_id ,e2.meter_number from user_details as e1 
join meter as e2 on e1.meter_id = e2.id  where e1.is_deleted = 0`
    const result = await executeQuery(query);
    return result;
}

const updateUserInDB = async()=>{
           
  
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

export {getAllUserFromDB,updateUserInDB,getUserByIdFromDB,deleteEventFromDB,changeRoleInDB}