
const express = require('express');
const router = express.Router();
const upload = require('../middleware/fileUpload')

const {Routes} = require('../constants/constant');
 
const {getEvents,getEventById ,createEvent,updateEvent,deleteEvent, getEventByLocation} = require('../controllers/eventController');

router.get(Routes.GET_EVENTS, getEvents);

router.get(Routes.GET_EVENT_BY_ID,getEventById)

router.get(Routes.SEARCH_EVENT_BY_LOCATION,getEventByLocation)

router.post(Routes.CREATE_EVENT ,upload.single('profile') , createEvent);

router.put(Routes.UPDATE_EVENT, updateEvent);

router.delete(Routes.DELETE_EVENT, deleteEvent);


module.exports = router;