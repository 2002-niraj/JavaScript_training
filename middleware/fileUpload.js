const multer = require("multer");

 //const { filetype } = require('../constants/constant')
 

 const storage = multer.memoryStorage();


const upload = multer({
   
    limits: {
        fileSize: 1000000
      }
});



module.exports = upload