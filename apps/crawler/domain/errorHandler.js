const { httpError } = require("./crawlerService");
const {ValidationError} = require("./validation");

class ErrorHandler {
    constructor() {
    }
  
    async handleError(error, res) {
      console.error('Error:', error);
      console.log(typeof error);
    
      if(res) {
        if(error instanceof httpError || error instanceof ValidationError) {
            res.status(400).json({
                error: 'Bad Request',
                message: error.message,  
            });
        }
        else
          res.status(500).json({
            error: 'Internal Server Error',
            message: 'Something went wrong on our end.',
          });
      }
      console.error(error);
    }
}

module.exports = ErrorHandler;