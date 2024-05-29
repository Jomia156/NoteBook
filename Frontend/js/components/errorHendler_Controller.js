import CustomError from "./customError"
const errorHendler = async (func) => {
    try {
        const result = await func()
        return result
    }
    catch (err) {
        if (!(err instanceof CustomError)) {
            console.log(err)
            alert("Произошла неизвестная ошибка. Попробуйте поторить позже.")
        }
        else {
            throw err
        }
    }
}