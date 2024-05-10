import NoteModule from "../modules/module.Note";
import { authorization } from "../middlewares/middleware.authorization";
export default function (app) {
    app.route({
        method: 'GET',
        url: '/api/:collection/note/:noteId',
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
        handler: NoteModule.get
    });
    app.route({
        method: 'POST',
        url: '/api/user/note',
        schema: {
            body: {
                type: "object",
                required: ["title, content"],
                properties: {
                    title: {
                        type: "string"
                    },
                    content: {
                        type: "object",
                        required: ["title, content"],
                        properties: {
                            type: {
                                type: "string",
                            },
                            body: {
                                type: "string"
                            }
                        }
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
        handler: NoteModule.create
    });
    app.route({
        method: 'POST',
        url: '/api/event/:eventId/note',
        schema: {
            body: {
                type: "object",
                required: ["title, content"],
                properties: {
                    title: {
                        type: "string"
                    },
                    content: {
                        type: "object",
                        required: ["title, content"],
                        properties: {
                            type: {
                                type: "string",
                            },
                            body: {
                                type: "string"
                            }
                        }
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
        handler: NoteModule.create
    });
    app.route({
        method: 'GET',
        url: '/api/user/notes',
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
        handler: NoteModule.getAll
    });
    app.route({
        method: 'GET',
        url: '/api/event/:eventId/notes',
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
        handler: NoteModule.getAll
    });
    app.route({
        method: 'DELETE',
        url: '/api/user/notes/:noteId',
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
        handler: NoteModule.remove
    });
    app.route({
        method: 'DELETE',
        url: '/api/event/:eventId/notes/:noteId',
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
        handler: NoteModule.remove
    });
}
