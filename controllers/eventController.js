
const { executeQuery } = require('../helper/eventHelper')
const cloudinary = require('../config/cloudinary')

const { Messages } = require('../constants/constant')
  
  const getEvents = async (req, res) => {
    try {
      const query = "select * from ??";
      const eventData = await executeQuery(query,[process.env.DB_TABLE])
      if(eventData.length === 0){
        return res.status(404).json({message:Messages.EVENT_NOT_FOUND})
      }
      res.status(200).json(eventData);
    } catch (error) {
      res.status(500).json({
        message:Messages.ERROR_INTERNAL,
        error:error.message
      });
    }
  };
  
  const getEventById = async (req, res) => {
    try {
      const { id } = req.params;
      const query = "select * from ?? where id =?"
      const eventData = await executeQuery(query,[process.env.DB_TABLE ,id]);
      if(eventData.length === 0){
        return res.status(404).json({message:`No event found of id ${id}`})
      }
      res.status(200).json(eventData);
    } catch (error) {
      res.status(500).json({
        message:Messages.ERROR_INTERNAL,
        error:error.message
      });
    }
  };

  const getEventByLocation = async(req,res)=>{
          
     try{
         const { location } = req.params;
         const query = "select * from ?? where location =?"
         const eventData = await executeQuery(query, [process.env.DB_TABLE , location]);

         if(eventData.length === 0){
          return res.status(404).json({message:`No event found at ${location} location`})
         }
         res.status(200).json(eventData);
     }
     catch(error){
      res.status(500).json({
        message:Messages.ERROR_INTERNAL,
        error:error.message
      });
     }
  }
  
  const createEvent = async (req, res) => {
    
    try {
      const { name, description,date_time, location } = req.body;

      if(!name || !date_time || !location){
        return res.status(500).json({
          message:Messages.REQUIRE_FIELD
        })
      }
     const result = await cloudinary.uploader.upload(req.file.path);      
      const query = 'insert into ?? (name, description,date_time, location ,image_path) values (?, ?, ?, ? ,?)'
     const data = await executeQuery(query,[process.env.DB_TABLE ,name, description,date_time, location,result.url.substring(49)])
     if(!data){
      return res.status(404).json({
        message:Messages.ERROR_INSERTION
      })
     }
      res.status(201).json({
             message: Messages.EVENT_CREATED,
            image_url: result.secure_url
           });
    } catch (error) {
      res.status(500).json({
        message:Messages.ERROR_INTERNAL,
        error: error.message,
      });
    }
  };


  
  const updateEvent = async (req, res) => {
  
    try {
      const { id } = req.params;
      const { name, description,date_time, location } = req.body;
       
        if(!name || !date_time || !location){
        return res.status(500).json({
          message:Messages.REQUIRE_FIELD
        })
      }
      
      const query = 'update ?? set name = ?, description = ?, date_time = ?,location = ? where id = ?'
    const data = await executeQuery(query,["events" ,name, description,date_time, location,id]);

    if(data.affectedRows>0){
      res.status(200).json({ message: Messages.EVENT_UPDATED });
    }
    else{
      res.status(400).json({ message: Messages.EVENT_NOT_FOUND });
    }
      
    } catch (error) {
      res.status(500).json({
        message:Messages.ERROR_INTERNAL,
        error: error.message,
      });
    }
  };
  
  const deleteEvent = async (req, res) => {
  
    try {
      const { id } = req.params;
      const query = 'delete from ?? where id = ?'
    const data =  await executeQuery(query,["events" ,id]);
    
    if(data.affectedRows>0){
      res.status(200).json({ message: Messages.EVENT_DELETED });
    }
    else{
      res.status(400).json({ message: Messages.EVENT_NOT_FOUND });
    }
      
    } catch (error) {
      res.status(500).json({
        message:Messages.ERROR_INTERNAL,
        error: error.message
      });
    }
  };
  
  module.exports = {
    getEvents,getEventById ,getEventByLocation,createEvent,updateEvent,deleteEvent
  };
  