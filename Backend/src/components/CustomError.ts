export default class CustomError extends Error {
    code=""
    status=0
    constructor(code:string = 'GENERIC', status:number = 500, ...params) {
        super(...params)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError)
        }
        this.status = status
        this.code = code

        if (status == 500) {

        }
    }
}