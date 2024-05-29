export default class CustomError extends Error {
    constructor() {
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError)
        }
    }
} 