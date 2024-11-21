const path = require('path');
const multer = require("multer");



const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});


const filefilter = (req,file,callback)=>{

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null,true);
    }
    else{
        callback(new Error('only .jpg and .png files are allowrd'),false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter:filefilter
});



module.exports = upload