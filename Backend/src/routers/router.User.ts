import { FastifyInstance } from "fastify";
import { UserModule } from "../modules/module.User";
import { authorization } from "../middlewares/middleware.authorization";

export default function (app: FastifyInstance) {
    app.route({
        method: 'GET',
        url: '/api/user/login',
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
    })

    app.route({
        method: 'POST',
        url: '/api/user/register',
        schema: {
            body: {
                type: "object",
                required: ["name", "login", "password", "email"],
                properties: {
                    name: {
                        type: "string"
                    },
                    login: {
                        type: "string"
                    },
                    password: {
                        type: "string"
                    },
                    email: {
                        type: "string"
                    }
                }
            }
        },
        handler: UserModule.register
    })

    app.route({
        method: 'GET',
        url: '/api/user/loginForReftesh',
        schema: {
            headers: {
                type: "object",
                required: ["authorization"],
                properties: {
                    authorization: {
                        type: "string"
                    }
                }
            }
        },
        preHandler: authorization,
        handler: UserModule.loginForRefresh
    })

    app.route({
        method: 'DELETE',
        url: '/api/user',
        schema: {
            headers: {
                type: "object",
                required: ["authorization"],
                properties: {
                    authorization: {
                        type: "string"
                    }
                }
            }
        },
        preHandler: authorization,
        handler: UserModule.removeUser
    })

    app.route({
        method: 'GET',
        url: '/api/user/verification',
        schema: {
            querystring: {
                type: "object",
                required: ["verificationCode"],
                properties: {
                    verificationCode: {
                        type: "string"
                    }
                }
            },
            headers: {
                type: "object",
                required: ["authorization"],
                properties: {
                    authorization: {
                        type: "string"
                    }
                }
            }
        },
        preHandler: authorization,
        handler: UserModule.verifiedUser
    })

    app.route({
        method: 'GET',
        url: '/api/user/verificationReload',
        schema: {
            headers: {
                type: "object",
                required: ["authorization"],
                properties: {
                    authorization: {
                        type: "string"
                    }
                }
            }
        },
        preHandler: authorization,
        handler: UserModule.verificationReload
    })

    app.route({
        method: 'PUT',
        url: '/api/user',
        schema: {
            headers: {
                type: "object",
                required: ["authorization"],
                properties: {
                    authorization: {
                        type: "string"
                    }
                }
            },
            body: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    avatar: {
                        type: "string"
                    },
                    password: {
                        type: "string"
                    }
                }
            }
        },
        preHandler: authorization,
        handler: UserModule.changeUserData
    })

    app.route({
        method: 'GET',
        url: '/api/user',
        schema: {
            headers: {
                type: "object",
                required: ["authorization"],
                properties: {
                    authorization: {
                        type: "string"
                    }
                }
            },
        },
        preHandler: authorization,
        handler: UserModule.getUserData
    })

    app.route({
        method: 'GET',
        url: '/api/user/list/:listType',
        schema: {
            headers: {
                type: "object",
                required: ["authorization"],
                properties: {
                    authorization: {
                        type: "string"
                    }
                }
            },
        },
        preHandler: authorization,
        handler: UserModule.getUserData
    })
}