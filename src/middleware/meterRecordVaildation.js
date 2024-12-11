import joi from "joi";

const createMeterRecordSchema = joi.object({
  user_id: joi.number().integer().required()
    .messages({
      "number.base": "user_id must be a valid number",
      "any.required": "user_id is required"
    }),

  meter_number: joi.string().required()
    .messages({
      "string.base": "meter_number must be a valid string",
      "any.required": "meter_number is required"
    }),

  reading_value: joi.number().greater(100).required()
    .messages({
      "number.base": "reading_value must be a valid number",
      "any.required": "reading_value is required",
      "number.greater": "reading_value must be greater than 100"
    }),

  reading_date: joi.date().required()
    .messages({
      "string.empty": "reading_date is required",
      "date.base": "reading_date must be a valid date",
      "any.required": "reading_date is required"
    }),

  is_paid: joi.string().min(2)
    .messages({
      "string.base": "is_paid must be a valid string",
      "string.min": "is_paid must have at least 2 characters"
    })
});

const updateMeterRecordSchema = joi.object({
  reading_value: joi.number().greater(100).required()
    .messages({
      "number.base": "reading_value must be a valid number",
      "any.required": "reading_value is required",
      "number.greater": "reading_value must be greater than 100"
    }),

  reading_date: joi.date().required()
    .messages({
      "any.required": "reading_date is required",
      "string.empty": "reading_date is required",
      "date.base": "reading_date must be a valid date"
    }),

  billing_amount: joi.number().required()
    .messages({
      "number.base": "billing_amount must be a valid number",
      "any.required": "billing_amount is required"
    }),

  is_paid: joi.string().min(2)
    .messages({
      "string.base": "is_paid must be a valid string",
      "string.min": "is_paid must have at least 2 characters"
    })
});

const validateCreateMeterRecord = (req, res, next) => {
  const { error } = createMeterRecordSchema.validate(req.body);

  if (error) {
    return res.status(422).send({ message: error.details[0].message, statusCode: 422 });
  }
  next();
};

const validateMeterRecordForFile = joi.array().items(createMeterRecordSchema).min(1).required()
  .messages({
    "array.min": "At least one meter record is required",
    "array.base": "Data must be an array",
    "any.required": "Meter records are required"
  });

const validateUpdateMeterRecord = (req, res, next) => {
  const { error } = updateMeterRecordSchema.validate(req.body);

  if (error) {
    return res.status(422).send({ message: error.details[0].message, statusCode: 422 });
  }
  next();
};

export { validateCreateMeterRecord, validateUpdateMeterRecord, validateMeterRecordForFile };
