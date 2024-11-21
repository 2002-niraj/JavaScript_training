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
           EVENT_NOT_FOUND:"Event not found",
           ERROR_INSERTION:"error in insert query",
           ERROR_INTERNAL:"internal server error",
           REQUIRE_FIELD:"Please provide required field"
  }
  
}

module.exports = constants;