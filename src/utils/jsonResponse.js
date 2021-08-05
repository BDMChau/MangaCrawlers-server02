const jsonResponse = (res, httpCode, code, is_success, data) => {
    res.status(httpCode).json({
        code,
        is_success,
        data
    })
    return;
}

module.exports = jsonResponse;