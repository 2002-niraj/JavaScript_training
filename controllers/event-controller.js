
const { executeQuery } = require('../helper/event-helper')
const cloudinary = require('../config/cloudinary')
  
  const getEvents = async (req, res) => {
    try {
      const query = "select * from ??";
      res.json(await executeQuery(query,["events"]));
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
  
  const getEventById = async (req, res) => {
    try {
      const { id } = req.params;
      const query = "select * from ?? where id =?"
      const data = await executeQuery(query,["events" ,id]);
      res.json(data);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  const getEventByLocation = async(req,res)=>{
          
     try{
         const { location } = req.params;
         const query = "select * from ?? where location =?"
         const data = await executeQuery(query, ["events" , location])
         res.json(data);
     }
     catch(error){
      res.status(500).json({
        error: error.message,
      });
     }
  }
  
  const createEvent = async (req, res) => {
    
    try {
      const { name, description,date_time, location } = req.body;
      // const image_path = `uploads/${req.file.filename}`

     const result = await cloudinary.uploader.upload(req.file.path);
     console.log(result.url.substring(49));
     console.log(result.secure_url);
      
      const query = 'insert into ?? (name, description,date_time, location ,image_path) values (?, ?, ?, ? ,?)'
      await executeQuery(query,["events" ,name, description,date_time, location,result.url.substring(49)])
      res.status(200).json({
             message:"Event created successfully",
            image_url: result.url
           });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };


  
  const updateEvent = async (req, res) => {
  
    try {

      const { name, description,date_time, location } = req.body;
      const { id } = req.params;
      const query = 'update ?? set name = ?, description = ?, date_time = ?,location = ? where id = ?'
      await executeQuery(query,["events" ,name, description,date_time, location,id])
      res.json({ message: "Event updated successfully" });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
  
  const deleteEvent = async (req, res) => {
  
    try {
      const { id } = req.params;
      const query = 'delete from ?? where id = ?'
      await executeQuery(query,["events" ,id]);
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
  
  module.exports = {
    getEvents,getEventById ,getEventByLocation,createEvent,updateEvent,deleteEvent
  };
  