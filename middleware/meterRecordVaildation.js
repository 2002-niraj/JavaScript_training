import joi from "joi";

const createMeterRecordSchema = joi.object({

  user_id: joi.number().integer().required()
    .messages({
      "number.base": "user_id must be vaild number"
    }),

  meter_id:joi.number().integer().required()
  .messages({
    "number.base": "meter_id must be vaild number"
  })
 ,
  reading_value: joi.number().greater(100).required().messages({
          "number.base": "user_id must be vaild number"
  }),

  reading_date:joi.date().required().messages({
          "string.empty": "date is required",
          "date.base": "date must be a valid.",
  })
  

});

const  updateMeterRecordSchema = joi.object({
      
reading_value: joi.number().greater(100).required().messages({
        "number.base": "user_id must be vaild number"
}),

reading_date:joi.date().required().messages({
        "any.required":"reading_date is requireds",
        "string.empty": "date is required",
        "date.base": "date must be a valid."

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

const vaildateMeterRecordForFile = joi.array().items(createMeterRecordSchema).min(1).required()
.messages({
  "array.min":"at least one meter record is required",
  "array.base":"data must be an array"
});



const vaildateUpdateMeterRecord = (req, res, next) => {
  const { error } =   updateMeterRecordSchema.validate(req.body);

  if (error) {
     //console.log(error)
    return res.status(400).send({ message: error.details[0].message });
  }
  next();
};



export { vaildateCreateMeterRecord,vaildateUpdateMeterRecord,vaildateMeterRecordForFile };
