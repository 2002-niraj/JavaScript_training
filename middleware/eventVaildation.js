const joi = require('joi');

const eventSchema = joi.object({
    name:joi.string().pattern(/^[a-zA-Z]/).max(250).required().messages({
        'string.empty': 'name is required',
        'string.pattern.base':'name should be start with letter',
        'string.size':'name character limit exceeded'
    }),
    description:joi.string().pattern(/^[a-zA-Z]/),
    start_date_time : joi.date().greater('now').required().messages({
           'string.empty': 'start_date_time is required',
           'date.greater': ' start_date_time is greater than future date',
           "date.base": "start_date_time must be a valid."
    }) ,
    end_date_time:joi.date().greater(joi.ref('start_date_time')).required().messages({
        'string.empty': 'end_date_time is required',
         'date.greater': ' end_date_time is greater than start_date_time',
           "date.base": "end_date_time must be a valid."

 }),
    city : joi.string().pattern(/^[a-zA-Z/s]+$/).max(250).required().messages({
        'string.empty': 'location is required',
        'string.pattern.base':'location should be contain letter',
        'string.size':'location character limit exceeded'
    }),
    venue : joi.string().pattern(/^[a-zA-Z]/).max(250).required().messages({
        'string.empty': 'venue is required',
        'string.pattern.base':'venue start with letter',
        'string.size':'venue character limit exceeded'
    }),
    email:joi.string().pattern(/^[a-zA-Z]/).required()
});


const vaildateEvent = (req,res,next)=>{
    const {name,description,start_date_time,end_date_time,city,venue} = req.body;
    const { error } = eventSchema.validate(req.body);

    if(error){
        // console.log(error)
        return res.status(400).send({message:error.details[0].message});
    }
    next();
}

module.exports = {vaildateEvent};