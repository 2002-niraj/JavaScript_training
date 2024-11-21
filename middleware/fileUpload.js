const path = require('path');
const multer = require("multer");



const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});


const filefilter = (req,file,cb)=>{

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }
    else{
        cb(new Error('only .jpg and .png files are allowrd'),false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter:filefilter
});



module.exports = upload