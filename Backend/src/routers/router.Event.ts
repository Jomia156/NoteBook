import { FastifyInstance } from "fastify";
import EventModule from "../modules/module.Event";
import { authorization } from "../middlewares/middleware.authorization";

export default function (app: FastifyInstance) {

    app.route({
        method: 'GET',
        url: '/api/event/eventId',
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
        handler: EventModule.get
    })

    app.route({
        method: 'POST',
        url: '/api/event',
        schema: {
            body: {
                type: "object",
                required: ["title","decription","date","time","geoposition"],
                properties: {
                    title: {
                        type: "string"
                    },
                    decription: {
                        type: "string"
                    },
                    date: {
                        type: "string"
                    },
                    time: {
                        type: "string"
                    },
                    geoposition: {
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
        handler: EventModule.create
    })

    app.route({
        method: 'DELETE',
        url: '/api/event/:eventId',
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
        handler: EventModule.remove
    })
    
    app.route({
        method: 'PUT',
        url: '/api/event',
        schema: {
            body: {
                type: "object",
                properties: {
                    title: {
                        type: "string"
                    },
                    decription: {
                        type: "string"
                    },
                    date: {
                        type: "string"
                    },
                    time: {
                        type: "string"
                    },
                    geoposition: {
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
        handler: EventModule.changeData
    })

    app.route({
        method: 'GET',
        url: '/api/event/:eventId/list/:listType',
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
        handler: EventModule.getList
    })

}
