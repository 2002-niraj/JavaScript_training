import joi from "joi";

const createUserSchema = joi.object({
  name: joi
    .string()
    .pattern(/^[a-zA-Z]/)
    .max(250)
    .required()
    .messages({
      "string.empty": "name is required",
      "string.pattern.base": "name should be start with letter",
      "string.max": "name character limit exceeded",
    }),

  email: joi.string().email().required().messages({
    "string.email": "email must be a vaild",
    "string.empty": "email is required",
  }),

  password: joi.string().min(3).max(250).messages({
    "string.max": "passoword character limit exceeded",
    "string.min": "password length must be 3 character long",
  }),

  contact: joi
    .string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "contact must be a vaild 10 digit number",
    }),
  city: joi
    .string()
    .pattern(/^[a-zA-Z/s]+$/)
    .max(250)
    .messages({
      "string.pattern.base": "city should be contain letter",
      "string.max": "city character limit exceeded",
    }),

  address: joi.string().max(250).messages({
    "string.max": "address character limit exceeded",
  }),
});




const updateUserSchema = joi.object({
  name: joi
    .string()
    .pattern(/^[a-zA-Z]/)
    .max(250)
    .required()
    .messages({
      "string.empty": "name is required",
      "string.pattern.base": "name should be start with letter",
      "string.max": "name character limit exceeded",
    }),

  email: joi.string().email().required().messages({
    "string.email": "email must be a vaild",
    "string.empty": "email is required",
  }),

  contact: joi
    .string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "contact must be a vaild 10 digit number",
    }),
  city: joi
    .string()
    .pattern(/^[a-zA-Z/s]+$/)
    .max(250)
    .messages({
      "string.pattern.base": "city should be contain letter",
      "string.max": "city character limit exceeded",
    }),

  address: joi.string().max(250).messages({
    "string.max": "address character limit exceeded",
  }),
});

const vaildateCreateUser = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body);

  if (error) {
    return res.status(422).send({
      message: error.details[0].message,statusCode:422
    });
  }
  next();
};



const vaildateUpdateUser = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body);

  if (error) {
    return res.status(422).send({ message: error.details[0].message,statusCode:422 });
  }
  next();
};

export { vaildateCreateUser, vaildateUpdateUser };
