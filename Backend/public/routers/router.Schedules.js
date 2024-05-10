import ScheduleModule from "../modules/module.Schedule";
import { authorization } from "../middlewares/middleware.authorization";
export default function (app) {
    app.route({
        method: 'GET',
        url: '/api/schedule',
        schema: {
            querystring: {
                type: "object",
                required: ["date"],
                properties: {
                    date: {
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
        handler: ScheduleModule.get
    });
    app.route({
        method: 'POST',
        url: '/api/schedule/task',
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
                required: ["date", "task"],
                properties: {
                    date: {
                        type: "string"
                    },
                    task: {
                        type: "object",
                        required: ["date", "time", "title", "description"],
                        properties: {
                            date: {
                                type: "string"
                            },
                            time: {
                                type: "string"
                            },
                            title: {
                                type: "string"
                            },
                            description: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        },
        preHandler: authorization,
        handler: ScheduleModule.createTask
    });
    app.route({
        method: 'PUT',
        url: '/api/schedule/task',
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
                    date: {
                        type: "string"
                    },
                    time: {
                        type: "string"
                    },
                    title: {
                        type: "string"
                    },
                    description: {
                        type: "string"
                    }
                }
            }
        },
        preHandler: authorization,
        handler: ScheduleModule.changeTask
    });
    app.route({
        method: 'DELETE',
        url: '/api/schedule/:taskId',
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
            querystring: {
                type: "object",
                required: ["date"],
                properties: {
                    date: {
                        type: "string"
                    }
                }
            }
        },
        preHandler: authorization,
        handler: ScheduleModule.removeTask
    });
}
