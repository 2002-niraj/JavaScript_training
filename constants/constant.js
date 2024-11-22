const constants = {

 Routes: {
    GET_EVENTS : '/events',
    GET_EVENT_BY_ID : '/events/:id',
    SEARCH_EVENT_BY_LOCATION:'/events/search/:location',
    CREATE_EVENT:'/events',
    UPDATE_EVENT:'/events/:id',
    DELETE_EVENT:'/events/:id'
  },

  Messages:{
           EVENT_CREATED:"Event created successfully",
           EVENT_UPDATED:"Event updated successfully",
           EVENT_DELETED:"Event deleted successfully",
           EVENT_NOT_FOUND:"Events not found",
           ERROR_INSERTION:"error in insert query",
           ERROR_INTERNAL:"internal server error",
           REQUIRE_FIELD:"Please provide required field",
           GET_EVENTS_QUERY:"select * from ??",
           GET_EVENTBYID_QUERY:"select * from ?? where id =?",
           GET_EVENTBYLOCATION_QUERY:"select * from ?? where location =?",
           CREATEEVENT_QUERY:"insert into ?? (name, description,date_time, location ,image_path) values (?, ?, ?, ? ,?)",
           UPDATEEVENT_QUERY:"update ?? set name = ?, description = ?, date_time = ?,location = ? where id = ?",
           DELETEEVENT_QUERY:"delete from ?? where id = ?"
  }
  
}

module.exports = constants;