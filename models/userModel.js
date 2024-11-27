import { executeQuery } from "../helper/helper.js";

const getUserFromDB = async (email) => {
  const query =
    "select id,name,email,password,role_id,contact from user_details where email = ?";
  const result = await executeQuery(query, [email]);
  return result;
};

const registerUserInDB = async (name, email, password, contact, city) => {
  const query =
    "insert into user_details (name,email,password,contact,city) values (?,?,?,?,?)";
  const result = await executeQuery(query, [
    name,
    email,
    password,
    contact,
    city,
  ]);
  return result;
};

const getUserDetails = async (user_id) => {
  const query = "select * from user_details where id = ?";
  const result = await executeQuery(query,user_id);
  return result;
};

export { registerUserInDB, getUserFromDB, getUserDetails };
