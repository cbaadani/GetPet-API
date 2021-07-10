class GetPetError extends Error {}

class NotFoundError extends GetPetError {
    constructor() {
        super('Not Found');
        this.status = 401;
    }
}

class InternalError extends GetPetError {
    constructor() {
        super('Internal Server Error');
        this.status = 500;
    }
}

class BadRequestError extends GetPetError {
    constructor(message = '') {
        super(`Bad Request ${message}`);
        this.status = 400;
    }
}

module.exports = {
    GetPetError,
    NotFoundError,
    InternalError,
    BadRequestError
};
