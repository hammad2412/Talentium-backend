import ErrorResponse from "../utils/ErrorResponse.js";

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true, // important, prevents extra fields (security)
    });

    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return next(new ErrorResponse(message, 400));
    }

    // replace request data with validated & sanitized data
    req[property] = value;
    next();
  };
};

export default validate;
