const {
    getEventFromDB,
    getEventByIdFromDB,
    createEventInDB,
    updateEventInDB,
    getEventByLocationDB,
    deleteEventFromDB,
  } = require("./model");
  
  const getEvents = async (req, res) => {
    try {
      const data = await getEventFromDB();
      res.json(data);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
  
  const getEventById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await getEventByIdFromDB(id);
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
         const data = await getEventByLocationDB(location)
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
      const image_path = `uploads/${req.file.filename}`
      await createEventInDB( name, description,date_time, location ,image_path);
      res.status(200).json({
             message:"Event created successfully",
            image_url: `http://localhost:8000/profile/${req.file.filename}`
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
      await updateEventInDB(id,name, description,date_time, location);
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
      await deleteEventFromDB(id);
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
  