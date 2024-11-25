
const cloudinary = require('../config/cloudinary')

const { messages,codes } = require('../constants/constant');

const {createError,sendErrorResponse} = require('../helper/eventHelper');
const streamifier = require('streamifier');

const {    getEventFromDB,
          getEventByIdFromDB,
  createEventInDB,
  updateEventInDB,
  getEventByLocationDB,
  deleteEventFromDB} = require('../model/eventModel')

  
  const getEvents = async (req, res) => {
    try {
      const eventData = await getEventFromDB();
      if(!eventData.length){
         throw createError(messages.EVENT_NOT_FOUND,codes.NOT_FOUND);
      }
      res.status(codes.SUCESS).json(eventData);
    } catch (error) {
      sendErrorResponse(res,error);

      }
    
  };


  
  const getEventById = async (req, res) => {
    try {
      const { id } = req.params;

      if(isNaN(Number(id))){
        throw createError(messages.INVAILD_ID,codes.BAD_REQUEST);

       }
      const eventData = await getEventByIdFromDB(id);
      if(!eventData.length){  
        throw createError('No event found of this id' , codes.NOT_FOUND)      
      }
      res.status(codes.SUCESS).json(eventData);
    } catch (error) {
      // res.status(error.statusCode).send({
      //   message:error.message
      // });
      sendErrorResponse(res,error);
    }
  };


  const getEventByLocation = async(req,res)=>{
          
     try{
         const { location } = req.params;
         const eventData = await getEventByLocationDB(location);

         if(!eventData.length){ 
          throw createError('No events found of at this location' , codes.NOT_FOUND)      
         }
         res.status(codes.SUCESS).json(eventData);
     }
     catch(error){
      sendErrorResponse(res,error);
     }
  }
  
  const createEvent = async (req, res) => {
    
    try {

      const { name, description,email, start_date_time, end_date_time, city,venue} = req.body;

      let uploadFromBuffer = (req) => {

        return new Promise((resolve, reject) => {
     
          let cld_upload_stream = cloudinary.uploader.upload_stream(
           {
           },
           (error, result) => {
     
             if (result) {
               resolve(result);
             } else {
               reject(error);
              }
            }
          );
     
          streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
        });
     
     };
     
     let result = await uploadFromBuffer(req);
      
     const data = await createEventInDB(name, description,email, start_date_time, end_date_time, city,venue ,result.url);

     if(!data){
      throw createError(messages.ERROR_INSERTION , 400);       
     }

      res.status(codes.CREATED).json({
             message: messages.EVENT_CREATED,
            image_url:result.url
      });

    } catch (error) {
        
      if (error.code == 'ER_DUP_ENTRY'){
       return res.status(400).send({
          message : messages.DUPLICATE_ENTRY
       });
      }
      sendErrorResponse(res,error);
      
    }
  };


  
  const updateEvent = async (req, res) => {
  
    try {
      const { id } = req.params;

       if(isNaN(Number(id))){
        throw createError(messages.INVAILD_ID,codes.BAD_REQUEST);

       }
      const { name, description,email, start_date_time, end_date_time, city,venue } = req.body;

    const data = await updateEventInDB(name, description,email, start_date_time, end_date_time, city,venue ,id);

    if(data.affectedRows>0){
      res.status(codes.SUCESS).send({ message: messages.EVENT_UPDATED });
    }
    else{ 
      throw createError(messages.EVENT_NOT_FOUND, codes.NOT_FOUND)
    }
      
    } catch (error) {
      
     if (error.code == 'ER_DUP_ENTRY'){
       return res.status(400).send({
          message : messages.DUPLICATE_ENTRY
       });
      }
      sendErrorResponse(res,error);

    }
  };
  

  const deleteEvent = async (req, res) => {
  
    try {
      const { id } = req.params;

      if(isNaN(Number(id))){
        throw createError(messages.INVAILD_ID,codes.BAD_REQUEST);
       }

       const dataExits = await getEventByIdFromDB(id);
       if(!dataExits.length){
        throw createError(messages.EVENT_NOT_FOUND,codes.NOT_FOUND);
       }

    const data =  await deleteEventFromDB(id);

    
    if(data.affectedRows>0){
      res.status(codes.SUCESS).send({ message: messages.EVENT_DELETED });
    }
    else{
      throw createError(messages.EVENT_NOT_FOUND,codes.NOT_FOUND);
    }
      
    } catch (error) {
         
      sendErrorResponse(res,error);

    }
  };
  
  module.exports = {
    getEvents,getEventById ,getEventByLocation,createEvent,updateEvent,deleteEvent
  };
  