const connection = require('./dbConnection');
require('dotenv').config();


const getEventFromDB= async () => {
    const [data] = await connection.promise().query("select * from ??", [process.env.DB_TABLE]);
    return data;
  };
  

  const getEventByIdFromDB = async (id) => {
    const [data] = await connection.promise().query("select * from ?? where id = ?", [process.env.DB_TABLE, id]);
    return data;
  };

  const getEventByLocationDB = async(location)=>{
      
     const [data] = await connection.promise().query("select * from ?? where location = ?" ,[process.env.DB_TABLE, location]);
     return data;
  }
  

  const createEventInDB = async (name, description,date_time, location ,image_path) => {

    const query = `insert into ?? (name, description,date_time, location ,image_path) values (?, ?, ?, ? ,?)`;
    await connection.promise().query(query, [process.env.DB_TABLE, name, description,date_time, location ,image_path]);
  };
  

  const updateEventInDB = async (id,name, description,date_time, location) => {
    const query = `update ?? set name = ?, description = ?, date_time = ?,location = ? where id = ?`;
    await connection.promise().query(query, [process.env.DB_TABLE,name, description,date_time, location, id]);
  };
  

  const  deleteEventFromDB = async (id) => {
    const query = `delete from ?? where id = ?`;
    await connection.promise().query(query, [process.env.DB_TABLE, id]);
  };
  
  module.exports = {
    getEventFromDB,
    getEventByIdFromDB,
    createEventInDB,
    updateEventInDB,
    getEventByLocationDB,
    deleteEventFromDB,
  };
