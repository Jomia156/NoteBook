export default class {
    async login(loginData) {
        return { code, statusCode, description, data } = fetch("/api/user/login?" + new URLSearchParams({ login, password }))

    }
}