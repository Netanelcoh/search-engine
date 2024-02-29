const Joi = require('joi');


function validateRequest(request) {
    const schema = Joi.object({
        url: Joi.string().uri({ scheme: ['https'] }).required(),
        maxDistance: Joi.number().default(5),
        maxSeconds: Joi.number().min(5).max(60),
        maxUrls: Joi.number().min(5).max(5000).default(5)
    });

    const {error} = schema.validate(request);
    if(error) throw new ValidationError(error.details[0].message);
}

function validateCrawlerRecord(record) {
    const schema = Joi.object({
        crawlId: Joi.string().length(8).required(),
        baseUrl: Joi.string().min(5).required(),
        url: Joi.string().min(5).required(),
        distance: Joi.number().required(),
        maxDistance: Joi.number().required(),
        maxTime: Joi.number().required(),
        maxUrls: Joi.number().required()
    });

    return schema.validate(record);
}

class ValidationError extends Error {
    constructor(message) {
      super(message);
    }
  }

module.exports.validateRequest = validateRequest;
module.exports.ValidationError = ValidationError