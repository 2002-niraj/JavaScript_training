import joi from "joi";

const createMeterRecordSchema = joi.object({

  user_id: joi.number().integer().required()
    .messages({
      "number.base": "user_id must be vaild number"
    }),

    meter_number:joi.string().pattern(/^[a-zA-Z]/).min(5).max(15).required().messages({
      "string.empty": "meter_number is required",
      "string.pattern.base": "meter_number should be start with letter",
       "string.max": "meter_number character limit exceeded",
        "string.min":"meter_number  length must be 5 character long"
    }),

  reading_value: joi.number().greater(100).required().messages({
          "number.base": "user_id must be vaild number"
  }),

  reading_date:joi.date().required().messages({
          "string.empty": "date is required",
          "date.base": "date must be a valid.",
  })
  

});

const  updateMeterRecordSchema = joi.object({
      
  user_id: joi.number().integer().required()
  .messages({
    "number.base": "user_id must be vaild number"
  }),

reading_value: joi.number().greater(100).required().messages({
        "number.base": "user_id must be vaild number"
}),

reading_date:joi.date().required().messages({
        "string.empty": "date is required",
        "date.base": "date must be a valid.",
})

});

const vaildateCreateMeterRecord = (req, res, next) => {
  const { error } =  createMeterRecordSchema.validate(req.body);

  if (error) {
     //console.log(error)
    return res.status(400).send({ message: error.details[0].message });
  }
  next();
};

const vaildateUpdateMeterRecord = (req, res, next) => {
  const { error } =   updateMeterRecordSchema.validate(req.body);

  if (error) {
     //console.log(error)
    return res.status(400).send({ message: error.details[0].message });
  }
  next();
};



export { vaildateCreateMeterRecord, vaildateUpdateMeterRecord };
