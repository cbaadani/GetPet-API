class NotFoundError extends Error {
    constructor() {
        this.status = 401;
        super('Not Found');
    }
}

class InternalError extends Error {
    constructor() {
        this.status = 500;
        super('Internal Server Error');
    }
}

module.exports = {
    NotFoundError,
    InternalError
};
