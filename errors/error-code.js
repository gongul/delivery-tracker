const ErrorCode = {
    BAD_REQUEST: {
        MESSAGE: "Bad Request Error",
        CODE: 400
    },
    UNAUTHRIZED: {
        MESSAGE: "권한 필수",
        CODE: 401
    },
    NOT_FOUND: {
        MESSAGE: "Not Found Error",
        CODE: 404
    },
    SEVER_ERROR: {
        MESSAGE: "Internal Server Error",
        CODE: 500
    },
    VALIDATION: {
        MESSAGE: "Validation Error",
        CODE: 422
    }
 };
 
 module.exports = ErrorCode;