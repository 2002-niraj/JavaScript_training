const eventRouter = require('express').Router();

const upload = require('../middleware/fileUpload')

const {routes} = require('../constants/constant');
const {vaildateEvent} = require('../middleware/eventVaildation')
 
const {getEvents,getEventById ,createEvent,updateEvent,deleteEvent, getEventByLocation} = require('../controllers/eventController');

eventRouter.get(routes.GET_EVENTS, getEvents);

eventRouter.get(routes.GET_EVENT_BY_ID,getEventById)

eventRouter.get(routes.SEARCH_EVENT_BY_LOCATION,getEventByLocation)

eventRouter.post(routes.CREATE_EVENT ,upload.single('profile') , vaildateEvent , createEvent);

eventRouter.put(routes.UPDATE_EVENT, vaildateEvent, updateEvent);

eventRouter.patch(routes.DELETE_EVENT, deleteEvent);

module.exports = eventRouter;