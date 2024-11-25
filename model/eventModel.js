const { executeQuery } = require('../helper/eventHelper');


const getEventFromDB= async () => {
    const data = await executeQuery("select id ,name, description, start_date_time, end_date_time, city, venue, created_by, image_path from ?? where is_deleted = 0", ["events"]);
    return data;
  };
  
  const getEventByIdFromDB = async (id) => {
    const data = await executeQuery("select id ,name, description, start_date_time, end_date_time, city,venue,created_by, image_path from ?? where is_deleted  = 0 and id = ?", ["events", id]);
    return data;
  };
  const getEventByLocationDB = async(city)=>{
      
     const data = await executeQuery("select id ,name, description, start_date_time, end_date_time, city,venue,created_by, image_path from ?? where is_deleted = 0 and city = ?" ,["events", city]);
     return data;
  };

  
  const createEventInDB = async (name, description, email,start_date_time, end_date_time, city,venue ,image_path) => {
    const query = "insert into ?? (name, description, created_by, start_date_time, end_date_time, city,venue,image_path) values (?, ?, ?, ? ,? ,?,?,?)";
    const data = await executeQuery(query, ["events", name, description, email, start_date_time, end_date_time, city ,venue,image_path]);
    return data;
  };
  
  const updateEventInDB = async (name, description,email, start_date_time, end_date_time, city,venue ,id) => {
    const query = "update ?? set name = ?, description = ?, created_by = ? start_date_time = ?, end_date_time= ? , city = ?,venue = ? where id = ? and is_deleted = 0"
    const data = await executeQuery(query, ["events",name, description,email, start_date_time, end_date_time, city,venue ,id]);
    return data;
  };
  
  const  deleteEventFromDB = async (id) => {
    const query = 'update ?? set is_deleted  = 1 where id = ?';
    const data = await executeQuery(query, ["events", id]);
    return data;
  };
  
  module.exports = {
    getEventFromDB,
    getEventByIdFromDB,
    createEventInDB,
    updateEventInDB,
    getEventByLocationDB,
    deleteEventFromDB,
  };