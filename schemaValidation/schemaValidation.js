const joi = require('joi');

const eventSchema = joi.object({
    name:joi.string().pattern(/^[a-zA-Z]/).max(250).required(),
    description:joi.string().pattern(/^[a-zA-Z]/),
    date_time : joi.date().greater('now').required(),
    location : joi.string().pattern(/^[a-zA-Z]/).max(250).required()
});

module.exports = eventSchema;