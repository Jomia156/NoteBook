import { UserModule } from "../modules/module.User";
export default function (app) {
    app.route({
        method: 'GET',
        url: '/api/login',
        schema: {
            querystring: {
                type: "object",
                required: ["login", "password"],
                properties: {
                    login: {
                        type: "string"
                    },
                    password: {
                        type: "string"
                    }
                }
            }
        },
        handler: UserModule.login
    });
}
