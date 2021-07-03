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

class BadRequestError extends Error {
    constructor(message = '') {
        this.status = 400;
        super(`Bad Request ${message}`);
    }
}

module.exports = {
    NotFoundError,
    InternalError,
    BadRequestError
};
