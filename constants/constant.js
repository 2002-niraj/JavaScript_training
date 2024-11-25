const { invalid } = require("joi");

const constants = {

 routes: {
    GET_EVENTS : '/events',
    GET_EVENT_BY_ID : '/events/:id',
    SEARCH_EVENT_BY_LOCATION:'/events/search/:location',
    CREATE_EVENT:'/events',
    UPDATE_EVENT:'/events/:id',
    DELETE_EVENT:'/events/:id'
  },

  messages:{
           EVENT_CREATED:"Event created successfully",
           EVENT_UPDATED:"Event updated successfully",
           EVENT_DELETED:"Event deleted successfully",
           EVENT_NOT_FOUND:"Event not found",
           ERROR_INSERTION:"error in insert query",
           INTERNAL_ERROR:"internal server error",
           REQUIRE_FIELD:"Please provide required field",
           INVAILD_ID:"id must be number or invaild id",
           DUPLICATE_ENTRY:"Duplicate entry Record is already exits"
  }

  ,
  codes:{
    SUCESS:200,
    CREATED:201,
    INTERNAL_SERVER_ERROR:500,
    NOT_FOUND:404,
    BAD_REQUEST:400
  }
  ,
  filetype :{
    FILEJPG:'image/jpeg',
    FILEPNG: 'image/png'
  }
  
}

module.exports = constants;