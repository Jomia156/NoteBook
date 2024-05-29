import errorHandler from "../components/errorHendler_Controller.js"
import quertyString from "../components/quertyString.js"
import CustomError from "../components/customError.js"

export default class UserController {
    static async logoff() {
        delete window.localStorage.accessToken
        delete window.localStorage.refreshToken
    }

    static async login(login, password) {
        return await errorHandler(async () => {
            const { statusCode, data, description } = await fetch("/api/user/login?" + quertyString({ login, password }).then(data => data.json()))
            if (statusCode == 200) {
                window.localStorage.accessToken = data.accessToken
                window.localStorage.refreshToken = data.refreshToken
            }
            else {
                throw new CustomError(description)
            }
        })
    }

    static async register(regData) {
        return await errorHandler(async () => {
            const { statusCode, data, description } = await fetch("/api/user/register", { method: "POST", body: JSON.stringify(regData) }).then(data => data.json())
            if (statusCode == 201) {
                await this.login(regData.login, password)
                return true
            }
            else {
                throw new CustomError(description)
            }
        })
    }

    static async loginForRefresh() {
        return await errorHandler(async () => {
            const { statusCode, data, description } = await fetch("/api/user/loginForRefresh", { headers: { Authorization: window.localStorage.refreshToken } }).then(data => data.json())
            if (statusCode == 200) {
                return true
            }
            throw new CustomError(description)

        })
    }

    static async getData() {
        return await errorHandler(async () => {
            const { statusCode, data, description } = await fetch("/api/user", { headers: { Authorization: window.localStorage.accessToken } }).then(data => data.json())
            if (statusCode == 200) {
                return data
            }
            else if (statusCode == 403) {
                const isLogin = await this.loginForRefresh()
                if (isLogin) {
                    this.getData()
                }
            }
        })
    }

    static async changeData(newData) {
        return await errorHandler(async () => {
            const { statusCode, data, description } = await fetch("/api/user", { method: "PUT", headers: { Authorization: window.localStorage.accessToken }, body: JSON.stringify(newData) }).then(data => data.json())
            if (statusCode == 201) {
                return true
            }
            throw new CustomError(description)
        })
    }

    static async remove() {
        return await errorHandler(async () => {
            const { statusCode, data, description } = await fetch("/api/user", { method: "DELETE", headers: { Authorization: window.localStorage.accessToken } }).then(data => data.json())
            if (statusCode == 204) {
                this.logoff()
                return true
            }
            throw new CustomError(description)
        })
    }

    static async verification(verificationCode) {
        return await errorHandler(async () => {
            const { statusCode, data, description } = await fetch("/api/user/verification?" + quertyString({ verificationCode }, { method: "GET", headers: { Authorization: window.localStorage.accessToken } })).then(data => data.json())
            if (statusCode == 201) {
                return true
            }
            throw new CustomError(description)
        })
    }

    static async verificationReload() {
        return await errorHandler(async () => {
            const { statusCode, data, description } = await fetch("/api/user/verificationReload", { method: "GET", headers: { Authorization: window.localStorage.accessToken } }).then(data => data.json())
            if (statusCode == 201) {
                return true
            }
            throw new CustomError(description)
        })
    }
}
