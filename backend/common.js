exports.handleError = (res, err) => {
    return res.status(500).json({
        message: "Some error occurred",
        error: err
    })
}