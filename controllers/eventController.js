
const { executeQuery } = require('../helper/eventHelper')
const eventSchema = require('../schemaValidation/schemaValidation')
const cloudinary = require('../config/cloudinary')

const { Messages } = require('../constants/constant')
  
  const getEvents = async (req, res) => {
    try {
      const query = Messages.GET_EVENTS_QUERY;
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
      const query = Messages.GET_EVENTBYID_QUERY
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
         const query = Messages.GET_EVENTBYLOCATION_QUERY;
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

      const {error} = eventSchema.validate(req.body);

      if(error){
        return res.status(400).json({
          error: error.message
      });
      }

     const result = await cloudinary.uploader.upload(req.file.path);      
      const query = Messages.CREATEEVENT_QUERY;
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
       
      const {error} = eventSchema.validate(req.body);

      if(error){
        return res.status(400).json({
          error: error.message
      });
      }
      
      const query = Messages.UPDATEEVENT_QUERY;
    const data = await executeQuery(query,[process.env.DB_TABLE ,name, description,date_time, location,id]);

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
      const query = Messages.DELETEEVENT_QUERY;
    const data =  await executeQuery(query,[process.env.DB_TABLE ,id]);
    
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
  