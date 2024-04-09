export default class CustomError extends Error {
    constructor(code = 'GENERIC', status = 500, ...params) {
        super(...params);
        this.code = "";
        this.status = 0;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
        this.status = status;
        this.code = code;
        if (status == 500) {
        }
    }
}
