const ERROR_CODE = require('../../../errors/error-code');

module.exports = function() {
    return function index(err, req, res, next) {
        if(err.statusCode == 404){
            err.message = err.message.replace(/\"|\\/g,"");
            err.name = "NotFoundError";
        }else if(err.statusCode == 422){
            delete err.details;
        } 

        next(err);
    };
};