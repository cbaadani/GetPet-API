module.exports = (handler) => async (req, res, next) => {
    try {
        const result = await handler(req, res, next);
        
        res.json(result);
    } catch (error) {
        return next(error)
    }
};
