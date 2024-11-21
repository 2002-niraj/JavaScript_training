
const express = require('express');
const app = express();
const upload = require('../middleware/fileUpload')
 
const {getEvents,getEventById ,createEvent,updateEvent,deleteEvent, getEventByLocation} = require('../controllers/eventController');

app.get('/events', getEvents);

app.get('/events/:id',getEventById)

app.get('/events/search/:location',getEventByLocation)

app.post('/events' ,upload.single('profile') , createEvent);

app.put('/events/:id', updateEvent);

app.delete('/events/:id', deleteEvent);


module.exports = app;