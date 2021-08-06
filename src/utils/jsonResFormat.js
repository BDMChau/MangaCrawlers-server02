const jsonResFormat = (httpCode, statusCode, bodyData) => {
    return {
       http_code: httpCode,
       http_status: statusCode,
       content: bodyData
    }
 }

module.exports = jsonResFormat;